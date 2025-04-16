const mongoose = require('mongoose');

const userAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // personality: {
  //   openness: { type: Number, required: true },
  //   conscientiousness: { type: Number, required: true },
  //   extraversion: { type: Number, required: true },
  //   agreeableness: { type: Number, required: true },
  //   neuroticism: { type: Number, required: true },
  // },
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
