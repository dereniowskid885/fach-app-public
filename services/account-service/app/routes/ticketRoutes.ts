import {
  createTicket,
  getTickets,
  deleteTicket,
  getTicketByID,
  ticketEvaluationHandler,
  ticketEvaluationAccept,
  updateTicket,
} from '@controllers/ticketController';

import express from 'express';
const router = express.Router();

import { createMiddleware } from '@shared/helpers/createMiddleware';
import { checkAndParseAccessToken } from '@shared/middlewares/authMiddleware';
import {
  validateCreateTicketMiddleware,
  validateTicketEvaluationAcceptMiddleware,
  validateTicketEvaluationMiddleware,
  validateTicketUpdateMiddleware,
} from '@middlewares/ticketValidationMiddleware';

// Auth middleware
const accessTokenMiddleware = createMiddleware(checkAndParseAccessToken, process.env.ACCESS_TOKEN_SECRET);
router.use(accessTokenMiddleware);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create ticket
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
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the ticket
 *                 example: "Ticket with some problem"
 *               description:
 *                 type: string
 *                 description: Description of the ticket
 *                 example: "Example ticket description"
 *               categoryId:
 *                 type: string
 *                 description: Unique ID of the category
 *                 example: "66df7gh8sasd6f66767rt6"
 *     responses:
 *       200:
 *         description: Ticket creation ended with success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ticket created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique ticket ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     city:
 *                       type: string
 *                       example: "Katowice"
 *                     category:
 *                       type: string
 *                       description: Category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     status:
 *                       type: string
 *                       description: Ticket status
 *                       enum:
 *                         - "Wycena"
 *                         - "Akceptacja wyceny"
 *                         - "Oczekiwanie na płatność"
 *                         - "W trakcie"
 *                         - "Akceptacja rozwiązania"
 *                         - "Badanie przez moderatora"
 *                         - "Ukończony"
 *                       example: "Wycena"
 *                     assignee:
 *                       type: string
 *                       description: User ID of the assignee
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     createdBy:
 *                       type: string
 *                       description: User ID of the ticket creator
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date of ticket creation
 *                       example: "2023-12-25T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date of last ticket update
 *                       example: "2023-12-25T10:00:00Z"
 *                     title:
 *                       type: string
 *                       description: Title of the ticket
 *                       example: "Ticket with some problem"
 *                     description:
 *                       type: string
 *                       description: Description of the ticket
 *                       example: "Example ticket description"
 *                     evaluations:
 *                       type: array
 *                       description: List of evaluations made by specialists
 *                       example: []
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_INVALID_DATA"
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Missing user data"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/', validateCreateTicketMiddleware, createTicket);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get tickets with filtering options
 *     description: Returns all tickets created by user (normal user), or related to specialist (tickets which have an accepted evaluation)
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by categoryId
 *         example: "66df7gh8sasd6f66767rt6"
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *         example: "Warszawa"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - "Wycena"
 *             - "Akceptacja wyceny"
 *             - "Oczekiwanie na płatność"
 *             - "W trakcie"
 *             - "Akceptacja rozwiązania"
 *             - "Badanie przez moderatora"
 *             - "Ukończony"
 *           example: "Wycena"
 *         description: Filter by ticket status
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: Filter by assignee (userId)
 *         example: "66df7gh8sasd6f66767rt6"
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: Filter by author (userId)
 *         example: "66df7gh8sasd6f66767rt6"
 *     responses:
 *       200:
 *         description: Array of tickets
 *         content:
 *            application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 dataLength:
 *                   type: number
 *                   example: "24"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique ticket ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       city:
 *                         type: string
 *                         example: "Katowice"
 *                       category:
 *                         type: string
 *                         description: Category ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       status:
 *                         type: string
 *                         description: Ticket status
 *                         enum:
 *                           - "Wycena"
 *                           - "Akceptacja wyceny"
 *                           - "Oczekiwanie na płatność"
 *                           - "W trakcie"
 *                           - "Akceptacja rozwiązania"
 *                           - "Badanie przez moderatora"
 *                           - "Ukończony"
 *                         example: "Wycena"
 *                       assignee:
 *                         type: string
 *                         description: User ID of the assignee
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       createdBy:
 *                         type: string
 *                         description: User ID of the ticket creator
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date of ticket creation
 *                         example: "2023-12-25T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date of last ticket update
 *                         example: "2023-12-25T10:00:00Z"
 *                       title:
 *                         type: string
 *                         description: Title of the ticket
 *                         example: "Ticket with some problem"
 *                       description:
 *                         type: string
 *                         description: Description of the ticket
 *                         example: "Example ticket description"
 *                       evaluations:
 *                         type: array
 *                         description: List of evaluations made by specialists
 *                         example: []
 *                       acceptedEvaluation:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "66df7gh8sasd6f66767rt6"
 *                           user:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   description: Specialist userId
 *                                   example: "66df7gh8sasd6f66767rt6"
 *                                 email:
 *                                   type: string
 *                                   description: Specialist email
 *                                   example: "jan@kowalski.pl"
 *                                 name:
 *                                   type: string
 *                                   description: Specialist name
 *                                   example: "Jan"
 *                                 surname:
 *                                   type: string
 *                                   description: Specialist surname
 *                                   example: "Fachowiec"
 *                           dateOfResponse:
 *                             type: string
 *                             format: date-time
 *                           price:
 *                             type: object
 *                             properties:
 *                               value:
 *                                 type: number
 *                                 format: float
 *                               currency:
 *                                 type: string
 *                                 enum: [PLN]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/', getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by id
 *     description: Fetches a single ticket from the database using its unique ID.
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the ticket
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6926f9a89c4a49ebb7a111f3"
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cdbd42cbe6d46c9b69f4e1"
 *                         name:
 *                           type: string
 *                           example: "Elektronika"
 *                     city:
 *                       type: string
 *                       example: "Katowice"
 *                     status:
 *                       type: string
 *                       example: "Oczekiwanie na płatność"
 *                     assignee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     updatedBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T12:57:59.597Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T13:38:05.133Z"
 *                     title:
 *                       type: string
 *                       example: "Nowy ticket"
 *                     description:
 *                       type: string
 *                       example: "Do testów"
 *                     evaluations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "692702bd90722be49451976e"
 *                     acceptedEvaluation:
 *                       type: string
 *                       example: "692702bd90722be49451976e"
 *       404:
 *         description: Ticket with provided id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Ticket with provided id not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/:id', getTicketByID);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete ticket by id
 *     description: Delete ticket with provided id
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ticket deleted successfully."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TOKEN_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No access token provided"
 *       403:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Required role is missing"
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Ticket with provided id not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.delete('/:id', deleteTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Update ticket
 *     description: Update a ticket with the provided ID.
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the ticket
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the ticket
 *                 example: "Updated ticket title"
 *               description:
 *                 type: string
 *                 description: Description of the ticket
 *                 example: "Updated ticket description"
 *               categoryId:
 *                 type: string
 *                 description: Unique ID of the category
 *                 example: "66df7gh8sasd6f66767rt6"
 *               city:
 *                 type: string
 *                 description: City of the ticket
 *                 example: "Warszawa"
 *               status:
 *                 type: string
 *                 description: Status of the ticket
 *                 enum:
 *                   - "Wycena"
 *                   - "Akceptacja wyceny"
 *                   - "Oczekiwanie na płatność"
 *                   - "W trakcie"
 *                   - "Akceptacja rozwiązania"
 *                   - "Badanie przez moderatora"
 *                   - "Ukończony"
 *                 example: "Wycena"
 *               assigneeId:
 *                 type: string
 *                 description: User ID of the assignee
 *                 example: "66df7gh8sasd6f66767rt6"
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ticket updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     title:
 *                       type: string
 *                       example: "Ticket with some problem"
 *                     description:
 *                       type: string
 *                       example: "Example ticket description"
 *                     city:
 *                       type: string
 *                       example: "Katowice"
 *                     category:
 *                       type: string
 *                       description: Category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     status:
 *                       type: string
 *                       description: Ticket status
 *                       enum:
 *                         - "Wycena"
 *                         - "Akceptacja wyceny"
 *                         - "Oczekiwanie na płatność"
 *                         - "W trakcie"
 *                         - "Akceptacja rozwiązania"
 *                         - "Badanie przez moderatora"
 *                         - "Ukończony"
 *                       example: "Wycena"
 *                     assignee:
 *                       type: string
 *                       description: User ID of the assignee
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     createdBy:
 *                       type: string
 *                       description: User ID of the ticket creator
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date of ticket creation
 *                       example: "2023-12-25T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date of last ticket update
 *                       example: "2023-12-25T10:00:00Z"
 *                     evaluations:
 *                       type: array
 *                       description: List of evaluations made by specialists
 *                       example: []
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_INVALID_DATA"
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Missing user data"
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Ticket with provided id not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.patch('/:id', validateTicketUpdateMiddleware, updateTicket);

/**
 * @swagger
 * /tickets/{id}/evaluation:
 *   patch:
 *     summary: Ticket evaluation (used by specialist)
 *     description: Ticket price and dateOfResponse evaluation
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the ticket
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ticket evaluated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6926f9a89c4a49ebb7a111f3"
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cdbd42cbe6d46c9b69f4e1"
 *                         name:
 *                           type: string
 *                           example: "Elektronika"
 *                     city:
 *                       type: string
 *                       example: "Katowice"
 *                     status:
 *                       type: string
 *                       example: "Oczekiwanie na płatność"
 *                     assignee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     updatedBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T12:57:59.597Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T13:38:05.133Z"
 *                     title:
 *                       type: string
 *                       example: "Nowy ticket"
 *                     description:
 *                       type: string
 *                       example: "Do testów"
 *                     evaluations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "692702bd90722be49451976e"
 *       400:
 *         description: Ticket does not have proper status for evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_INVALID_STATUS"
 *                 message:
 *                   type: string
 *                   example: Ticket does not have proper status for evaluation.
 *       403:
 *         description: Missing permissions to evaluate a ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: Missing permissions to evaluate a ticket.
 *       404:
 *         description: Ticket with provided id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: Ticket with provided id not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.patch('/:id/evaluation', validateTicketEvaluationMiddleware, ticketEvaluationHandler);

/**
 * @swagger
 * /tickets/{id}/accept-evaluation:
 *   patch:
 *     summary: Ticket evaluation accept (used by ticket owner)
 *     description: Ticket evaluation accept for ticket owner
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the ticket
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ticket evaluation accepted successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6926f9a89c4a49ebb7a111f3"
 *                     category:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cdbd42cbe6d46c9b69f4e1"
 *                         name:
 *                           type: string
 *                           example: "Elektronika"
 *                     city:
 *                       type: string
 *                       example: "Katowice"
 *                     status:
 *                       type: string
 *                       example: "Oczekiwanie na płatność"
 *                     assignee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     updatedBy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "67cefecdeb74325f86678feb"
 *                         email:
 *                           type: string
 *                           example: "leinad885@o2.pl"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T12:57:59.597Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-26T13:38:05.133Z"
 *                     title:
 *                       type: string
 *                       example: "Nowy ticket"
 *                     description:
 *                       type: string
 *                       example: "Do testów"
 *                     evaluations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "692702bd90722be49451976e"
 *                     acceptedEvaluation:
 *                       type: string
 *                       example: "692702bd90722be49451976e"
 *       400:
 *         description: Ticket does not have proper status for evaluation accept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TICKET_INVALID_STATUS"
 *                 message:
 *                   type: string
 *                   example: Ticket does not have proper status for evaluation accept.
 *       403:
 *         description: Missing permissions to accept ticket evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: Missing permissions to accept ticket evaluation.
 *       404:
 *         description: Evaluation with provided id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_EVALUATION_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: Evaluation with provided id does not exist.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.patch('/:id/accept-evaluation', validateTicketEvaluationAcceptMiddleware, ticketEvaluationAccept);

export default router;
