const express = require('express');
const { createTicket, getUserTickets } = require('../controllers/ticketController');
const router = express.Router();

router.post('/', createTicket);
router.get('/', getUserTickets);

module.exports = router;
