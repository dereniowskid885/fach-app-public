import {
  createTicket,
  getTickets,
  getMyTickets,
  getSpecialistAvailableTickets,
  deleteTicket,
  getTicketByID,
  ticketEvaluationHandler,
  ticketEvaluationAccept,
  updateTicket,
  ticketPaymentHandler,
  ticketEvaluationEdit,
} from '@controllers/ticketController';

import express from 'express';
const router = express.Router();

import { createMiddleware } from '@shared/helpers/createMiddleware';
import { checkAndParseAccessToken, checkUserRole } from '@shared/middlewares/authMiddleware';
import {
  validateCreateTicketMiddleware,
  validateTicketEvaluationAcceptMiddleware,
  validateTicketEvaluationEditMiddleware,
  validateTicketEvaluationMiddleware,
  validateTicketPaymentMiddleware,
  validateTicketUpdateMiddleware,
} from '@middlewares/ticketValidationMiddleware';
import { EUserRole } from '@shared/enums/role';

// Role middleware
const checkSpecialistRole = createMiddleware(checkUserRole, [EUserRole.SPECIALIST]);
const checkIsUserRole = createMiddleware(checkUserRole, [EUserRole.USER]);
const checkAdminRole = createMiddleware(checkUserRole, [EUserRole.ADMIN]);

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
 *               - city
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
 *               city:
 *                 type: string
 *                 description: City associated with the ticket
 *                 example: "Warsaw"
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
 *                   example: Ticket created successfully
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
 *                   example: Invalid data provided
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
 *                   example: Missing user data
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
 *                   example: Required role is missing
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
 *                   example: Server error
 */
router.post('/', validateCreateTicketMiddleware, checkIsUserRole, createTicket);

/**
 * @swagger
 * /tickets/{id}/payment:
 *   post:
 *     summary: Ticket payment
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
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Numeric value of the price
 *                 example: 250.5
 *               currency:
 *                 type: string
 *                 description: Currency code (e.g., PLN)
 *                 example: "PLN"
 *     responses:
 *       200:
 *         description: Ticket payment successfull
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
 *                   example: Ticket payment successfull
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientSecret:
 *                       type: string
 *                       example: "src_client_secret_sBqfX18eq6GPfGxGvVfMByCp"
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
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
 *                   example: Error occured on ticket payment
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
 *                   example: Missing user data
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
 *                   example: Server error
 */
router.post('/:id/payment', validateTicketPaymentMiddleware, ticketPaymentHandler);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get tickets with filtering options (admin only)
 *     description: Returns all tickets
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
 *                   example: Missing user data
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
 *                   example: Server error
 */
router.get('/', checkAdminRole, getTickets);

/**
 * @swagger
 * /tickets/my:
 *   get:
 *     summary: Get tickets with filtering options (for my tickets page)
 *     description: Returns all tickets excluding completed and canceled (user role - tickets created by user, and allow filtering by category, specialist role - tickets where acceptedEvaluation belongs to the specialist, and allow filtering by city)
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
 *                   example: Missing user data
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
 *                   example: Server error
 */
router.get('/my', getMyTickets);

/**
 * @swagger
 * /tickets/specialist/available:
 *   get:
 *     summary: Get tickets with city filtering (for specialist available tickets page)
 *     description: Returns all tickets with awaiting_evaluation status and specialist category for specialist ticket page view
 *     tags:
 *       - Ticketing
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *         example: "Warszawa"
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
 *                   example: Missing user data
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
 *                   example: Server error
 */
router.get('/specialist/available', checkSpecialistRole, getSpecialistAvailableTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket by ID (admin only)
 *     description: Fetches a single ticket from the database using its unique ID
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
 *                   example: Ticket with provided id not found
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
 *                   example: Server error
 */
router.get('/:id', checkAdminRole, getTicketByID);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete ticket by ID
 *     description: Deletes a ticket with the provided unique ID
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
 *                   example: Ticket deleted successfully
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
 *                   example: No access token provided
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
 *                   example: Required role is missing
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
 *                   example: Ticket with provided ID not found
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
 *                   example: Server error
 */
router.delete('/:id', deleteTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Update ticket
 *     description: Updates a ticket with the provided unique ID
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
 *                   example: Ticket updated successfully
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
 *                   example: Invalid data provided
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
 *                   example: Missing user data
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
 *                   example: Ticket with provided ID not found
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
 *                   example: Server error
 */
router.patch('/:id', validateTicketUpdateMiddleware, updateTicket);

/**
 * @swagger
 * /tickets/{id}/evaluation:
 *   patch:
 *     summary: Ticket evaluation (specialist only)
 *     description: Allows a specialist to evaluate a ticket by providing a price (in cents, cannot be lower than 200) and response time (in minutes, cannot be lower than 30)
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
 *                   amountInCents:
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
 *                   example: Ticket evaluated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Ticket already has an evaluation by the current specialist, or provided data is invalid
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
 *                   example: "ERROR_TICKET_ALREADY_EVALUATED_BY_USER"
 *                 message:
 *                   type: string
 *                   example: Ticket already has an evaluation by the current specialist, or provided data is invalid
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
 *                   example: Missing permissions to evaluate a ticket
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
 *                   example: Ticket with provided id not found
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
 *                   example: Server error
 */
router.patch('/:id/evaluation', validateTicketEvaluationMiddleware, checkSpecialistRole, ticketEvaluationHandler);

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
 *                   example: Ticket evaluation accepted successfully
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
 *                   example: Ticket does not have proper status for evaluation accept
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
 *                   example: Missing permissions to accept ticket evaluation
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
 *                   example: Evaluation with provided id does not exist
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
 *                   example: Server error
 */
router.patch('/:id/accept-evaluation', validateTicketEvaluationAcceptMiddleware, ticketEvaluationAccept);

/**
 * @swagger
 * /tickets/{id}/edit-evaluation:
 *   patch:
 *     summary: Ticket evaluation edit (specialist only)
 *     description: Ticket evaluation edit used by specialist, who has already made an evaluation
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
 *               price:
 *                 type: object
 *                 description: Price set by the specialist
 *                 properties:
 *                   amountInCents:
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
 *
 *     responses:
 *       200:
 *         description: Ticket evaluation updated successfully
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
 *                   example: Ticket evaluation updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Evaluation edit is not allowed in current ticket status
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
 *                   example: Evaluation edit is not allowed in current ticket status
 *       403:
 *         description: Missing permissions to edit an evaluation
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
 *                   example: Missing permissions to edit an evaluation
 *       404:
 *         description: Evaluation with provided id does not belong to provided ticket or does not exist
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
 *                   example: Evaluation with provided id does not belong to provided ticket or does not exist
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
 *                   example: Server error
 */
router.patch('/:id/edit-evaluation', validateTicketEvaluationEditMiddleware, checkSpecialistRole, ticketEvaluationEdit);

export default router;
