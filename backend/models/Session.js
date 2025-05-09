const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  // rating: {
  //   type: Number, // from 1 to 5
  //   default: 5,
  // },
  embedUrl: {
    type: String,
    default: '',
  },
 
  //  embedHtml: {
  //   type: String,
  //   default: '',
  // },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
