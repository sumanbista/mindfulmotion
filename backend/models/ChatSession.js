// backend/models/ChatSession.js
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String, // Updated to match the `uid` field in the User schema
    required: true,
    ref: 'User', // Reference the User model
  },
  title: { type: String, default: 'New Conversation' },
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
