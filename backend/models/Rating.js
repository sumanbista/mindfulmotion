const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String, // Updated to match the `uid` field in the User schema
    required: true,
    ref: 'User', // Reference the User model
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: true });

// Compound index to ensure one rating per user per session
ratingSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);