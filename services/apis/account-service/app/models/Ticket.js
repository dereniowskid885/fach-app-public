const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ETicketStatus } = require('@constants/ticketStatus');
const { ESupportedCurrency } = require('@constants/supportedCurrency');

const Evaluation = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfResponse: {
    type: Date,
    required: true,
  },
  price: {
    value: { type: Number, required: true },
    currency: { type: String, enum: [ESupportedCurrency.PLN], required: true },
  },
});

const ticketSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
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
      ETicketStatus.PRICE_EVALUATION,
      ETicketStatus.PRICE_USER_ACCEPTATION,
      ETicketStatus.PENDING_PAYMENT,
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.SOLUTION_USER_APPROVAL,
      ETicketStatus.MODERATOR_INVESTIGATION,
      ETicketStatus.COMPLETED,
    ],
    required: false,
    default: ETicketStatus.PRICE_EVALUATION,
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: function () {
      return this.createdBy;
    },
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  evaluations: [Evaluation],
});

module.exports = mongoose.model('Ticket', ticketSchema);
