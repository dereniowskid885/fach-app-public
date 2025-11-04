const {
  createTicket,
  getUserTickets,
  deleteTicket,
  getSpecialistAvailableTickets,
  getTicketByID,
  getTicketsByCategoryID,
  ticketEvaluationHandler,
  ticketEvaluationAccept,
} = require('../controllers/ticketController');

const jwt = require('jsonwebtoken');
const express = require('express');
const createMiddleware = require('@helpers/createMiddleware');
const { checkAndParseAccessToken, checkUserRole } = require('@middlewares/authMiddleware');
const { EUserRole } = require('@constants/userRole');

// Role middleware
const checkSpecialistRole = createMiddleware(checkUserRole, [EUserRole.SPECIALIST]);

// Auth middleware
const accessTokenMiddleware = createMiddleware(checkAndParseAccessToken, jwt, process.env.ACCESS_TOKEN_SECRET);
const router = express.Router();
router.use(accessTokenMiddleware);

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
 *                 type: object
 *                 properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: "jan@kowalski.pl"
 *               createdBy:
 *                 type: object
 *                 properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: "jan@kowalski.pl"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date of ticket creation
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Date of ticket last update
 *               updatedBy:
 *                 type: object
 *                 description: User which updated the ticket lately
 *                 properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     email:
 *                       type: string
 *                       description: User email
 *                       example: "jan@kowalski.pl"
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
 *     summary: Get tickets related to user
 *     description: Returns all tickets created by user (normal user), or related to specialist (tickets which have an accepted evaluation)
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
 *                    type: object
 *                    properties:
 *                        _id:
 *                          type: string
 *                          description: User ID
 *                          example: "66df7gh8sasd6f66767rt6"
 *                        email:
 *                          type: string
 *                          description: User email
 *                          example: "jan@kowalski.pl"
 *                   createdBy:
 *                    type: object
 *                    properties:
 *                        _id:
 *                          type: string
 *                          description: User ID
 *                          example: "66df7gh8sasd6f66767rt6"
 *                        email:
 *                          type: string
 *                          description: User email
 *                          example: "jan@kowalski.pl"
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
 *                   updatedBy:
 *                    type: object
 *                    description: User which updated the ticket lately
 *                    properties:
 *                        _id:
 *                          type: string
 *                          description: User ID
 *                          example: "66df7gh8sasd6f66767rt6"
 *                        email:
 *                          type: string
 *                          description: User email
 *                          example: "jan@kowalski.pl"
 *                   title:
 *                     type: string
 *                     description: Title of the ticket
 *                     example: "Ticket with some problem"
 *                   description:
 *                     type: string
 *                     description: Description of the ticket
 *                     example: "Example ticket description"
 *                   evaluations:
 *                      type: array
 *                      description: "List of evaluations made by specialists"
 *                      items:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                            description: User ID
 *                            example: "66df7gh8sasd6f66767rt6"
 *                          user:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                                description: Specialist userId
 *                                example: "66df7gh8sasd6f66767rt6"
 *                              email:
 *                                type: string
 *                                description: Specialist email
 *                                example: "jan@kowalski.pl"
 *                              name:
 *                                type: string
 *                                description: Specialist name
 *                                example: "Jan"
 *                              surname:
 *                                type: string
 *                                description: Specialist surname
 *                                example: "Fachowiec"
 *                              city:
 *                                type: string
 *                                description: Specialist city
 *                                example: "Lublin"
 *                          dateOfResponse:
 *                            type: string
 *                            format: date-time
 *                          price:
 *                            type: object
 *                            properties:
 *                              value:
 *                                type: number
 *                                format: float
 *                              currency:
 *                                type: string
 *                                enum: [PLN]
 *                   acceptedEvaluation:
 *                      type: object
 *                      properties:
 *                        user:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                                description: Specialist userId
 *                                example: "66df7gh8sasd6f66767rt6"
 *                              email:
 *                                type: string
 *                                description: Specialist email
 *                                example: "jan@kowalski.pl"
 *                              name:
 *                                type: string
 *                                description: Specialist name
 *                                example: "Jan"
 *                              surname:
 *                                type: string
 *                                description: Specialist surname
 *                                example: "Fachowiec"
 *                        dateOfResponse:
 *                          type: string
 *                          format: date-time
 *                        price:
 *                          type: object
 *                          properties:
 *                            value:
 *                              type: number
 *                              format: float
 *                            currency:
 *                              type: string
 *                              enum: [PLN]
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
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
 *                   updatedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
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
 *                   updatedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
 *                   title:
 *                     type: string
 *                     description: Title of the ticket
 *                     example: "Ticket with some problem"
 *                   description:
 *                     type: string
 *                     description: Description of the ticket
 *                     example: "Example ticket description"
 *                   evaluations:
 *                      type: array
 *                      description: "List of evaluations made by specialists"
 *                      items:
 *                        type: object
 *                        properties:
 *                          _id:
 *                            type: string
 *                            description: User ID
 *                            example: "66df7gh8sasd6f66767rt6"
 *                          user:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                                description: User ID
 *                                example: "66df7gh8sasd6f66767rt6"
 *                              email:
 *                                type: string
 *                                description: User email
 *                                example: "jan@kowalski.pl"
 *                              name:
 *                                type: string
 *                                description: Specialist name
 *                                example: "Jan"
 *                              surname:
 *                                type: string
 *                                description: Specialist surname
 *                                example: "Fachowiec"
 *                              city:
 *                                type: string
 *                                description: Specialist city
 *                                example: "Lublin"
 *                          dateOfResponse:
 *                            type: string
 *                            format: date-time
 *                          price:
 *                            type: object
 *                            properties:
 *                              value:
 *                                type: number
 *                                format: float
 *                              currency:
 *                                type: string
 *                                enum: [PLN]
 *                   acceptedEvaluation:
 *                      type: object
 *                      properties:
 *                        user:
 *                            type: object
 *                            properties:
 *                              _id:
 *                                type: string
 *                                description: Specialist userId
 *                                example: "66df7gh8sasd6f66767rt6"
 *                              email:
 *                                type: string
 *                                description: Specialist email
 *                                example: "jan@kowalski.pl"
 *                              name:
 *                                type: string
 *                                description: Specialist name
 *                                example: "Jan"
 *                              surname:
 *                                type: string
 *                                description: Specialist surname
 *                                example: "Fachowiec"
 *                        dateOfResponse:
 *                          type: string
 *                          format: date-time
 *                        price:
 *                          type: object
 *                          properties:
 *                            value:
 *                              type: number
 *                              format: float
 *                            currency:
 *                              type: string
 *                              enum: [PLN]
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
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
 *                   updatedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       email:
 *                         type: string
 *                         description: User email
 *                         example: "jan@kowalski.pl"
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

/**
 * @swagger
 * /tickets/{id}/evaluation:
 *   patch:
 *     summary: Ticket price and dateOfResponse evaluation
 *     description: Ticket evaluation for specialists
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *               - minutes
 *             properties:
 *               price:
 *                  type: object
 *                  description: Price set by specialist and accepted by ticket author
 *                  properties:
 *                    value:
 *                      type: number
 *                      description: The numeric value of the price
 *                    currency:
 *                      type: string
 *                      description: Currency code (e.g., PLN, USD, EUR)
 *               minutes:
 *                 type: number
 *                 description: Evaluated minutes as time of first response
 *                 example: "60"
 *     responses:
 *       200:
 *         description: Ticket evaluated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket evaluated successfully
 *       400:
 *         description: Ticket does not have proper status for evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket does not have proper status for evaluation
 *       403:
 *         description: Missing permissions to evaluate a ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing permissions to evaluate a ticket
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
 *         description: Server error during ticket evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during ticket evaluation
 */
router.patch('/:id/evaluation', ticketEvaluationHandler);

/**
 * @swagger
 * /tickets/{id}/accept-evaluation:
 *   patch:
 *     summary: Ticket evaluation accept
 *     description: Ticket evaluation accept for ticket owner
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evaluationId
 *             properties:
 *               evaluationId:
 *                 type: string
 *                 example: "67c48e3fd50f0e2e0050381d"
 *     responses:
 *       200:
 *         description: Ticket evaluation accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket evaluation accepted successfully
 *       400:
 *         description: Ticket does not have proper status for evaluation accept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ticket does not have proper status for evaluation accept
 *       403:
 *         description: Missing permissions to accept ticket evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing permissions to accept ticket evaluation
 *       404:
 *         description: Evaluation with provided id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evaluation with provided id does not exist
 *       500:
 *         description: Server error during ticket evaluation accept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during ticket evaluation accept
 */
router.patch('/:id/accept-evaluation', ticketEvaluationAccept);

module.exports = router;
