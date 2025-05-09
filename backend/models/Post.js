const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,// Updated to match the `uid` field in the User schema
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  userId: {
    type: String, // Updated to match the `uid` field in the User schema
    required: true,
    ref: 'User', // Reference the User model
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  comments: [commentSchema],
  loves: [{
    type: String, // Changed from ObjectId to String to match the `uid` field in the User schema
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
