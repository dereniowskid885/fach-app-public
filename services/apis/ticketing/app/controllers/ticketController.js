const Ticket = require('../models/Ticket');

const getUserTickets = async (req, res) => {
  try {
    const user = req.user;

    const tickets = await Ticket.find({ createdBy: user.email });

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

const createTicket = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, category } = req.body;

    const ticket = new Ticket({ createdBy: user.email, assignee: user.email, title, description, category });

    try {
      await ticket.save();
      return res.status(200).json({ message: 'Ticket created successfully' });
    } catch (err) {
      return res.status(400).json({
        message: 'Error while creating new ticket',
        error: err.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

module.exports = {
  createTicket,
  getUserTickets,
};
