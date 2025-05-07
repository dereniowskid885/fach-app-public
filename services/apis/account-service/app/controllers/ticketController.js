const Ticket = require('../models/Ticket');
const { EUserRole } = require('@constants/userRole');
const { ETicketStatus } = require('@constants/ticketStatus');

const getTicketByID = async (req, res) => {
  try {
    const ticketID = req.params.id;

    const ticket = await Ticket.findOne({ _id: ticketID }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'evaluations.user', select: 'email name surname city' },
    ]);

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

    const tickets = await Ticket.find({ category: categoryId }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
    ]);

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

    const tickets = await Ticket.find({ assignee: user.userId }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'evaluations.user', select: 'email name surname city' },
    ]);

    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of tickets',
      error: err.message,
    });
  }
};

const getSpecialistAvailableTickets = async (req, res) => {
  try {
    let city = req.params.city;

    if (!city) {
      city = req.user.city;
    }

    const allowedStatuses = [ETicketStatus.PRICE_EVALUATION, ETicketStatus.PRICE_USER_ACCEPTATION];
    const tickets = await Ticket.find({
      city,
      status: {
        $in: allowedStatuses,
      },
    }).populate([
      { path: 'category', select: 'name' },
      { path: 'assignee', select: 'email' },
      { path: 'createdBy', select: 'email' },
      { path: 'updatedBy', select: 'email' },
      { path: 'evaluations.user', select: 'email name surname city' },
    ]);

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
      createdBy: user.userId,
      assignee: user.userId,
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
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = ticket.createdBy.toString() === user.userId;

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

const ticketEvaluationHandler = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket with provided id does not exist' });
    }

    // PRICE_USER_ACCEPTATION status is also here to allow other specialists to evaluate a ticket
    const isEligibleForEvaluation = [ETicketStatus.PRICE_EVALUATION, ETicketStatus.PRICE_USER_ACCEPTATION].includes(
      ticket.status,
    );
    if (!isEligibleForEvaluation) {
      return res.status(400).json({ message: 'Ticket does not have proper status for evaluation' });
    }

    const user = req.user;
    const isAdmin = user.role === EUserRole.ADMIN;
    const isSpecialist = user.role === EUserRole.SPECIALIST;

    if (!isAdmin && !isSpecialist) {
      return res.status(403).json({ message: 'Missing permissions to evaluate a ticket' });
    }

    const { price, minutes } = req.body;

    const currentDate = new Date();
    // create date of response by adding minutes (as miliseconds) to current date
    const dateOfResponse = new Date(currentDate.getTime() + minutes * 60000);

    if (ticket.status === ETicketStatus.PRICE_EVALUATION) {
      ticket.status = ETicketStatus.PRICE_USER_ACCEPTATION;
    }

    ticket.updatedBy = user.userId;
    ticket.updatedAt = currentDate;
    ticket.evaluations.push({
      user: user.userId,
      price,
      dateOfResponse,
    });

    await ticket.save();

    return res.status(200).json({ message: 'Ticket evaluated successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during ticket evaluation',
      error: err.message,
    });
  }
};

const ticketEvaluationAccept = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket with provided id does not exist' });
    }

    const isEligibleForEvaluation = ticket.status === ETicketStatus.PRICE_USER_ACCEPTATION;
    if (!isEligibleForEvaluation) {
      return res.status(400).json({ message: 'Ticket does not have proper status for evaluation accept' });
    }

    const user = req.user;
    const isAdmin = user.role === EUserRole.ADMIN;
    const isOwner = user.userId === ticket.createdBy.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Missing permissions to accept ticket evaluation' });
    }

    const { evaluationId } = req.body;
    const acceptedEvaluation = ticket.evaluations.find((evaluation) => evaluation.id === evaluationId);

    if (!acceptedEvaluation) {
      return res.status(404).json({ message: 'Evaluation with provided id does not exist' });
    }

    ticket.acceptedEvaluation = acceptedEvaluation;
    ticket.updatedBy = user.userId;
    ticket.status = ETicketStatus.PENDING_PAYMENT;
    await ticket.save();

    return res.status(200).json({ message: 'Ticket evaluation accepted successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during ticket evaluation accept',
      error: err.message,
    });
  }
};

module.exports = {
  createTicket,
  deleteTicket,
  getUserTickets,
  getSpecialistAvailableTickets,
  getTicketByID,
  getTicketsByCategoryID,
  ticketEvaluationHandler,
  ticketEvaluationAccept,
};
