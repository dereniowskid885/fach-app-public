const mongoose = require('mongoose');
const Ticket = require('./Ticket');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  specialists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const categoryId = this._id;
  await Ticket.deleteMany({ category: categoryId });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
