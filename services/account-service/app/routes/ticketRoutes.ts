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
 *         description: Ticket created successfully
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
 *                   $ref: '#/components/schemas/Ticket'
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
 *       - $ref: '#/components/parameters/TicketStatusQuery'
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 dataLength:
 *                   type: number
 *                   example: 24
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
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
router.get('/', getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
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
 *                   $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket with provided ID not found
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
 *     summary: Delete ticket by ID
 *     description: Deletes a ticket with the provided unique ID.
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
 *         description: Forbidden due to invalid role
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
 *                   example: "Ticket with provided ID not found."
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
 *     description: Updates a ticket with the provided unique ID.
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
 *                 description: Updated title of the ticket
 *                 example: "Updated ticket title"
 *               description:
 *                 type: string
 *                 description: Updated description of the ticket
 *                 example: "Updated ticket description"
 *               categoryId:
 *                 type: string
 *                 description: Unique ID of the category
 *                 example: "66df7gh8sasd6f66767rt6"
 *               city:
 *                 type: string
 *                 description: City associated with the ticket
 *                 example: "Warszawa"
 *               status:
 *                 $ref: '#/components/schemas/TicketStatus'
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
 *                   $ref: '#/components/schemas/Ticket'
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
 *                   example: "Ticket with provided ID not found."
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
 *     description: Allows a specialist to evaluate a ticket by providing a price and response time (minutes).
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
 *                 type: object
 *                 description: Price set by the specialist
 *                 properties:
 *                   value:
 *                     type: number
 *                     description: Numeric value of the price
 *                     example: 250.5
 *                   currency:
 *                     type: string
 *                     description: Currency code (e.g., PLN)
 *                     example: "PLN"
 *               minutes:
 *                 type: number
 *                 description: Evaluated minutes as the time of first response
 *                 example: 60
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
 *                   example: "Ticket evaluated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
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
 *                   example: "Ticket does not have proper status for evaluation."
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
 *                   example: "Missing permissions to evaluate a ticket."
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
 *                   example: "Ticket evaluation accepted successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
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
 *                   example: "Ticket does not have proper status for evaluation accept."
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
 *                   example: "Missing permissions to accept ticket evaluation."
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
 *                   example: "Evaluation with provided id does not exist."
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
