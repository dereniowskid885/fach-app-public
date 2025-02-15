const express = require('express');
const { createTicket, getUserTickets } = require('../controllers/ticketController');
const router = express.Router();

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create new ticket
 *     tags:
 *       - Ticketing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 enum:
 *                  - "Mechanika pojazdowa"
 *                  - "Elektronika"
 *                  - "Dom"
 *                 description: Ticket category
 *               status:
 *                 type: string
 *                 enum:
 *                  - "Wycena"
 *                  - "Akceptacja wyceny"
 *                  - "Oczekiwanie na płatność"
 *                  - "W trakcie"
 *                  - "Akceptacja rozwiązania"
 *                  - "Badanie przez moderatora"
 *                  - "Ukończony"
 *                 description: Ticket status
 *               assignee:
 *                 type: string
 *                 description: Currently assigned user
 *               createdBy:
 *                 type: string
 *                 description: Author of the ticket
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date of ticket creation
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date of ticket last update
 *               price:
 *                 type: string
 *                 description: Price set by specialist and accepted by ticket author
 *               title:
 *                 type: string
 *                 description: Title of the ticket
 *               description:
 *                 type: string
 *                 description: Description of the ticket
 *
 *     responses:
 *       200:
 *         description: Ticket creation ended with success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket created successfully
 *       400:
 *         description: Ticket validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket validation error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error during ticket creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during ticket creation
 */
router.post('/', createTicket);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Retrieve all tickets
 *     description: Returns all tickets created by logged user
 *     tags:
 *       - Ticketing
 *     responses:
 *       200:
 *         description: Tickets created by logged user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique ticket ID
 *                     example: "66df7gh8sasd6f66767rt6"
 *                   category:
 *                     type: string
 *                     enum:
 *                      - "Mechanika pojazdowa"
 *                      - "Elektronika"
 *                      - "Dom"
 *                     description: Ticket category
 *                     example: "Elektronika"
 *                   status:
 *                     type: string
 *                     enum:
 *                      - "Wycena"
 *                      - "Akceptacja wyceny"
 *                      - "Oczekiwanie na płatność"
 *                      - "W trakcie"
 *                      - "Akceptacja rozwiązania"
 *                      - "Badanie przez moderatora"
 *                      - "Ukończony"
 *                     description: Ticket status
 *                     example: "Wycena"
 *                   assignee:
 *                     type: string
 *                     description: Currently assigned user
 *                     example: "jan.kowalski@onet.pl"
 *                   createdBy:
 *                     type: string
 *                     description: Author of the ticket
 *                     example: "jan.kowalski@onet.pl"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date of ticket creation
 *                     example: "December 25, 2023, at 10:00 AM"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date of ticket last update
 *                     example: "December 25, 2023, at 10:00 AM"
 *                   price:
 *                     type: string
 *                     description: Price set by specialist and accepted by ticket author
 *                     example: "5 PLN"
 *                   title:
 *                     type: string
 *                     description: Title of the ticket
 *                     example: "Ticket with some problem"
 *                   description:
 *                     type: string
 *                     description: Description of the ticket
 *                     example: "Example ticket description"
 *       500:
 *         description: Server error during retrieval of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during retrieval of tickets
 */
router.get('/', getUserTickets);

module.exports = router;
