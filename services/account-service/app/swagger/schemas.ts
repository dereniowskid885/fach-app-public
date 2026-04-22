/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b5678"
 *         name:
 *           type: string
 *           example: "Electronics"
 *         specialists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     Evaluation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b9101"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         dateOfResponse:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *         minutes:
 *           type: number
 *           example: 30
 *         price:
 *           type: object
 *           properties:
 *             amountInCents:
 *               type: number
 *               format: float
 *               example: 250.5
 *             currency:
 *               $ref: '#/components/schemas/Currency'
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b1234"
 *         email:
 *           type: string
 *           example: "user@example.com"
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         name:
 *           type: string
 *           example: "Jan"
 *         surname:
 *           type: string
 *           example: "Nowak"
 *         city:
 *           type: string
 *           example: "Warsaw"
 *         isVerified:
 *           type: boolean
 *           example: true
 *         theme:
 *           type: string
 *           enum:
 *             - light
 *             - dark
 *             - system
 *           example: system
 *     UserRole:
 *       type: string
 *       enum:
 *         - user
 *         - specialist
 *         - admin
 *       example: user
 *     ThemeType:
 *       type: string
 *       enum:
 *         - light
 *         - dark
 *         - system
 *       example: system
 *     Language:
 *       type: string
 *       enum:
 *         - pl
 *         - en
 *     Currency:
 *       type: string
 *       enum:
 *         - PLN
 *         - EUR
 *     TicketStatus:
 *       type: string
 *       enum:
 *         - awaiting_evaluation
 *         - awaiting_payment
 *         - in_progress
 *         - solution_review
 *         - moderator_investigation
 *         - completed
 *         - canceled
 *       example: awaiting_evaluation
 *     PaymentStatus:
 *       type: string
 *       enum:
 *         - pending
 *         - succeeded
 *         - failed
 *         - canceled
 *         - refunded
 *       example: pending
 *     Ticket:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b5678"
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         city:
 *           type: string
 *           example: "Warsaw"
 *         status:
 *           $ref: '#/components/schemas/TicketStatus'
 *         assignee:
 *           $ref: '#/components/schemas/User'
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *         updatedBy:
 *           $ref: '#/components/schemas/User'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *         title:
 *           type: string
 *           example: "Problem with computer"
 *         description:
 *           type: string
 *           example: "Detailed description of the problem"
 *         evaluations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Evaluation'
 *         acceptedEvaluation:
 *           $ref: '#/components/schemas/Evaluation'
 *         commentsCount:
 *           type: number
 *           example: 0
 *         specialistCommentsCount:
 *           type: number
 *           example: 0
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b5678"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         userRole:
 *           $ref: '#/components/schemas/UserRole'
 *         ticket:
 *           $ref: '#/components/schemas/Ticket'
 *         content:
 *           type: string
 *           example: "This is a comment on the ticket"
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "https://cdn.com/attachment1.jpg"
 *             - "https://cdn.com/attachment2.pdf"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f3b12a6f4c1e9d3a7b5678"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         ticket:
 *           $ref: '#/components/schemas/Ticket'
 *         amount:
 *           type: number
 *           format: float
 *           example: 20
 *         currency:
 *           $ref: '#/components/schemas/Currency'
 *         paymentMethod:
 *           type: string
 *           example: "BLIK"
 *         status:
 *           $ref: '#/components/schemas/PaymentStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-25T10:00:00Z"
 *
 */
