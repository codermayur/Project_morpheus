const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test(v),
        message: 'Invalid Indian phone number',
      },
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    avatar: {
      url: String,
      publicId: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      state: String,
      district: String,
      village: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          index: '2dsphere',
        },
      },
    },

    farmSize: {
      value: Number,
      unit: {
        type: String,
        enum: ['acres', 'hectares'],
        default: 'acres',
      },
    },
    crops: [
      {
        type: String,
        enum: ['rice', 'wheat', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'pulses', 'other'],
      },
    ],
    languages: [
      {
        type: String,
        enum: ['hindi', 'english', 'punjabi', 'tamil', 'telugu', 'marathi', 'bengali', 'gujarati'],
        default: ['hindi'],
      },
    ],

    isExpert: {
      type: Boolean,
      default: false,
    },
    expertDetails: {
      specialization: String,
      qualifications: [String],
      experience: Number,
      verificationDocs: [
        {
          type: {
            type: String,
            enum: ['aadhar', 'degree', 'certificate', 'id'],
          },
          url: String,
          publicId: String,
        },
      ],
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },

    stats: {
      followersCount: { type: Number, default: 0 },
      followingCount: { type: Number, default: 0 },
      postsCount: { type: Number, default: 0 },
      questionsAsked: { type: Number, default: 0 },
      answersGiven: { type: Number, default: 0 },
    },

    preferences: {
      language: {
        type: String,
        default: 'hindi',
      },
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      privacy: {
        profileVisibility: {
          type: String,
          enum: ['public', 'followers', 'private'],
          default: 'public',
        },
        showLocation: { type: Boolean, default: true },
      },
    },

    fcmTokens: [
      {
        token: String,
        device: String,
        createdAt: Date,
      },
    ],
    refreshTokens: [
      {
        token: String,
        expiresAt: Date,
      },
    ],
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },

    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ name: 'text' });
userSchema.index({ 'location.state': 1, 'location.district': 1 });
userSchema.index({ isExpert: 1, 'expertDetails.specialization': 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
