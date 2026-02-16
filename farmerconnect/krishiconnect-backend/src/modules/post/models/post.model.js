const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['text', 'image', 'video', 'poll'],
      required: true,
    },
    content: {
      text: {
        type: String,
        maxlength: 5000,
      },
      voice: {
        url: String,
        publicId: String,
        duration: Number,
        transcription: String,
      },
    },

    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
        },
        url: String,
        publicId: String,
        thumbnail: String,
        size: Number,
        dimensions: {
          width: Number,
          height: Number,
        },
      },
    ],

    poll: {
      question: String,
      options: [
        {
          text: String,
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        },
      ],
      endsAt: Date,
    },

    hashtags: [
      {
        type: String,
        lowercase: true,
        index: true,
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      enum: [
        'farming-tips',
        'crop-advice',
        'pest-control',
        'irrigation',
        'market-news',
        'government-schemes',
        'success-story',
        'question',
        'general',
      ],
      default: 'general',
    },

    stats: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
    reports: [
      {
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        reportedAt: Date,
      },
    ],
    moderationFlags: {
      spam: { type: Boolean, default: false },
      inappropriate: { type: Boolean, default: false },
      misinformation: { type: Boolean, default: false },
    },

    visibility: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,

    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ 'content.text': 'text' });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'stats.likes': -1 });

module.exports = mongoose.model('Post', postSchema);
