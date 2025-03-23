const Ticket = require('../models/Ticket');

const getTicketByID = async (req, res) => {
  try {
    const ticketID = req.params.id;

    const ticket = await Ticket.findOne({ _id: ticketID });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of ticket',
      error: err.message,
    });
  }
};

const getTicketsByCategoryID = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const tickets = await Ticket.find({ category: categoryId });

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of tickets',
      error: err.message,
    });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const user = req.user;

    const tickets = await Ticket.find({ assignee: user.email }).populate('category', 'name');

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of tickets',
      error: err.message,
    });
  }
};

const getAvailableTickets = async (req, res) => {
  try {
    const { city } = req.user;

    const tickets = await Ticket.find({ city }).populate('category', 'name');

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

    const ticket = new Ticket({
      createdBy: user.email,
      assignee: user.email,
      city: user.city,
      title,
      description,
      category,
    });

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
  getAvailableTickets,
  getTicketByID,
  getTicketsByCategoryID,
};
