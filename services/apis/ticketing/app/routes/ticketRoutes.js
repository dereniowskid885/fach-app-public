const createMiddleware = require('@helpers/createMiddleware');
const { checkUserRole } = require('@middlewares/authMiddleware');
const checkSpecialistRole = createMiddleware(checkUserRole, ['specialist']);

const {
  createTicket,
  getUserTickets,
  deleteTicket,
  getSpecialistAvailableTickets,
  getTicketByID,
  getTicketsByCategoryID,
} = require('../controllers/ticketController');
const express = require('express');
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
 *               city:
 *                 type: string
 *                 example: "Katowice"
 *               category:
 *                 type: object
 *                 properties:
 *                     _id:
 *                       type: string
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Category name
 *                       example: "Elektronika"
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
 *     summary: Retrieve all tickets created by logged user
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
 *                   city:
 *                     type: string
 *                     example: "katowice"
 *                   category:
 *                     type: object
 *                     properties:
 *                         _id:
 *                           type: string
 *                           description: Unique category ID
 *                           example: "66df7gh8sasd6f66767rt6"
 *                         name:
 *                           type: string
 *                           description: Category name
 *                           example: "Elektronika"
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

/**
 * @swagger
 * /tickets/specialist/{city}:
 *   get:
 *     summary: Retrieve pending tickets for specialist (ready to be taken)
 *     description: Returns tickets filtered by specialist category and that are created by users from the same city as specialist (or by city provided in parameter)
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: city
 *         required: false
 *         description: City ​​by which the returned tickets will be filtered
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pending tickets - ready to be taken by specialist
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
 *                   city:
 *                     type: string
 *                     example: "Katowice"
 *                   category:
 *                     type: object
 *                     properties:
 *                         _id:
 *                           type: string
 *                           description: Unique category ID
 *                           example: "66df7gh8sasd6f66767rt6"
 *                         name:
 *                           type: string
 *                           description: Category name
 *                           example: "Elektronika"
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
router.get('/specialist/:city', checkSpecialistRole, getSpecialistAvailableTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete ticket
 *     description: Delete ticket with provided id
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deletion ended with success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket deleted successfully
 *       403:
 *         description: Missing permissions to delete the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing permissions to delete the ticket
 *       404:
 *         description: Ticket with provided id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket with provided id does not exist
 *       500:
 *         description: Server error during ticket deletion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during ticket deletion
 */
router.delete('/:id', deleteTicket);

/**
 * @swagger
 * /tickets/by-id/{id}:
 *   get:
 *     summary: Retrieve a ticket by ID
 *     description: Fetches a single ticket from the database using its unique ID.
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique id of the ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   _id:
 *                     type: string
 *                     description: Unique ticket ID
 *                     example: "66df7gh8sasd6f66767rt6"
 *                   city:
 *                     type: string
 *                     example: "Katowice"
 *                   category:
 *                     type: object
 *                     properties:
 *                         _id:
 *                           type: string
 *                           description: Unique category ID
 *                           example: "66df7gh8sasd6f66767rt6"
 *                         name:
 *                           type: string
 *                           description: Category name
 *                           example: "Elektronika"
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
 *       404:
 *         description: Ticket with provided id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket with provided id does not exist
 *       500:
 *         description: Server error during ticket retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during ticket retrieval
 */
router.get('/by-id/:id', getTicketByID);

/**
 * @swagger
 * /tickets/by-categoryid/{categoryId}:
 *   get:
 *     summary: Retrieve tickets by categoryId
 *     description: Retrieve all tickets found by categoryId
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: Unique categoryId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tickets found by provided categoryId
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
 *                   city:
 *                     type: string
 *                     example: "katowice"
 *                   category:
 *                     type: object
 *                     properties:
 *                         _id:
 *                           type: string
 *                           description: Unique category ID
 *                           example: "66df7gh8sasd6f66767rt6"
 *                         name:
 *                           type: string
 *                           description: Category name
 *                           example: "Elektronika"
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
router.get('/by-categoryid/:categoryId', getTicketsByCategoryID);

module.exports = router;
