const Ticket = require('../models/Ticket');

const getUserTickets = async (req, res) => {
  try {
    const user = req.user;

    const tickets = await Ticket.find({ createdBy: user.email });

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of tickets',
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
      return res.status(500).json({
        message: 'Error while creating new ticket',
        error: err.message,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during ticket creation',
      error: err.message,
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket with provided id does not exist' });
    }

    const user = req.user;
    const isAdmin = user.role === 'admin';
    const isOwner = ticket.createdBy === user.email;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Missing permissions to delete the ticket' });
    }

    await Ticket.deleteOne({ _id: ticketId });

    return res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during ticket deletion',
      error: err.message,
    });
  }
};

module.exports = {
  createTicket,
  deleteTicket,
  getUserTickets,
};
