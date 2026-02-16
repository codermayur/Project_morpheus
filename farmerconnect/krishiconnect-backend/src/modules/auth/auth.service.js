const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../user/user.model');
const sendOTP = require('../../utils/sendOTP.js');
const ApiError = require('../../utils/ApiError');
const { OTP_EXPIRY_SECONDS, OTP_MAX_ATTEMPTS } = require('../../config/constants');
const { getRedis } = require('../../config/redis');

// In-memory fallback for development when Redis unavailable
const memoryStore = new Map();

class AuthService {
  async generateOTP(phoneNumber) {
    const otp = crypto.randomInt(100000, 999999).toString();

    const redis = getRedis();
    if (redis) {
      await redis.set(`otp:${phoneNumber}`, JSON.stringify({ otp, attempts: 0 }), {
        EX: OTP_EXPIRY_SECONDS,
      });
    }

    await sendOTP(phoneNumber, otp);
    return { otpSent: true };
  }

  async verifyOTP(phoneNumber, otp) {
    const redis = getRedis();
    if (!redis) {
      // Development fallback: accept any 6-digit OTP when Redis unavailable
      if (process.env.NODE_ENV === 'development' && /^\d{6}$/.test(otp)) {
        return { verified: true };
      }
      throw new ApiError(500, 'OTP verification unavailable');
    }

    const storedData = await redis.get(`otp:${phoneNumber}`);
    if (!storedData) {
      throw new ApiError(400, 'OTP expired or not found');
    }

    const { otp: storedOTP, attempts } = JSON.parse(storedData);

    if (attempts >= OTP_MAX_ATTEMPTS) {
      await redis.del(`otp:${phoneNumber}`);
      throw new ApiError(429, 'Too many failed attempts');
    }

    if (storedOTP !== otp) {
      await redis.set(`otp:${phoneNumber}`, JSON.stringify({ otp: storedOTP, attempts: attempts + 1 }), {
        EX: OTP_EXPIRY_SECONDS,
      });
      throw new ApiError(400, 'Invalid OTP');
    }

    await redis.del(`otp:${phoneNumber}`);
    return { verified: true };
  }

  async register(userData) {
    const { phoneNumber, password, name, location } = userData;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      throw new ApiError(409, 'Phone number already registered');
    }

    await this.generateOTP(phoneNumber);

    const userPayload = JSON.stringify({ password, name, location });
    const redis = getRedis();
    if (redis) {
      await redis.set(`temp:user:${phoneNumber}`, userPayload, { EX: 3600 });
    } else if (process.env.NODE_ENV === 'development') {
      memoryStore.set(`temp:user:${phoneNumber}`, userPayload);
      setTimeout(() => memoryStore.delete(`temp:user:${phoneNumber}`), 3600 * 1000);
    }

    return { otpSent: true, phoneNumber };
  }

  async completeRegistration(phoneNumber, otp) {
    await this.verifyOTP(phoneNumber, otp);

    const redis = getRedis();
    let tempData = redis ? await redis.get(`temp:user:${phoneNumber}`) : null;
    if (!tempData && process.env.NODE_ENV === 'development') {
      tempData = memoryStore.get(`temp:user:${phoneNumber}`);
    }
    if (!tempData) {
      throw new ApiError(400, 'Registration session expired');
    }

    const userData = typeof tempData === 'string' ? JSON.parse(tempData) : tempData;
    const user = await User.create({
      phoneNumber,
      ...userData,
    });

    if (redis) {
      await redis.del(`temp:user:${phoneNumber}`);
    }
    memoryStore.delete(`temp:user:${phoneNumber}`);

    const tokens = this.generateTokens(user._id);
    await this.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      user: user.toObject(),
      tokens,
    };
  }

  async login(phoneNumber, password) {
    const user = await User.findOne({ phoneNumber }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (user.isBanned) {
      throw new ApiError(403, 'Account is banned');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const tokens = this.generateTokens(user._id);
    await this.saveRefreshToken(user._id, tokens.refreshToken);

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      tokens,
    };
  }

  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId: userId.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: userId.toString(), type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(userId, {
      $push: {
        refreshTokens: {
          token: refreshToken,
          expiresAt,
        },
      },
    });
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const user = await User.findOne({
        _id: decoded.userId,
        'refreshTokens.token': refreshToken,
      });

      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const accessToken = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return { accessToken };
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }

  async logout(userId, refreshToken) {
    const redis = getRedis();
    if (redis && refreshToken) {
      try {
        const decoded = jwt.decode(refreshToken);
        if (decoded?.exp) {
          const ttl = decoded.exp - Math.floor(Date.now() / 1000);
          if (ttl > 0) {
            await redis.set(`blacklist:${refreshToken}`, '1', { EX: ttl });
          }
        }
      } catch (err) {
        // Ignore decode errors
      }
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });

    return { success: true };
  }
}

module.exports = new AuthService();
