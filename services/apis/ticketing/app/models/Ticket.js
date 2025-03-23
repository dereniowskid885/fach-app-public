const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'Wycena',
      'Akceptacja wyceny',
      'Oczekiwanie na płatność',
      'W trakcie',
      'Akceptacja rozwiązania',
      'Badanie przez moderatora',
      'Ukończony',
    ],
    required: false,
    default: 'Wycena',
  },
  assignee: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  price: {
    type: String,
    required: true,
    default: '-',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
