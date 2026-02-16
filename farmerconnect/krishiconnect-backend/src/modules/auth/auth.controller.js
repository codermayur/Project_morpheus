const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, 'OTP sent to your phone'));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const result = await authService.completeRegistration(phoneNumber, otp);
  res.status(200).json(new ApiResponse(200, result, 'Registration successful'));
});

const login = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const result = await authService.login(phoneNumber, password);
  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
  await authService.logout(req.user._id, refreshToken);
  res.status(200).json(new ApiResponse(200, { success: true }, 'Logged out successfully'));
});

module.exports = {
  register,
  verifyOTP,
  login,
  refreshToken,
  logout,
};
