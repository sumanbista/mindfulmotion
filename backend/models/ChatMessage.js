// backend/models/ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  role: { type: String, enum: ['user','assistant','system'], required: true },
  text: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
