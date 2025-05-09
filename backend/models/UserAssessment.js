const mongoose = require('mongoose');

const userAssessmentSchema = new mongoose.Schema({
  userId: {
    type: String, // Updated to match the `uid` field in the User schema
    required: true,
    ref: 'User', // Reference the User model
  },
  mentalHealth: {
    depression: { type: Number, required: true },
    anxiety: { type: Number, required: true },
    stress: { type: Number, required: true },
  },
  wellness: {
    mood: { type: Number, required: true },
    sleep: { type: Number, required: true },
    physicalActivity: { type: Number, required: true },
    socialInteraction: { type: Number, required: true },
    selfCare: { type: Number, required: true },
    stressManagement: { type: Number, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('UserAssessment', userAssessmentSchema);
