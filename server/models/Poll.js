const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h', // This creates a TTL index that automatically deletes the document after 24 hours
  },
});

module.exports = mongoose.model('Poll', pollSchema);