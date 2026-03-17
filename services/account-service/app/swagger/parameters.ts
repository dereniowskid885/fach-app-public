/**
 * @swagger
 * components:
 *   parameters:
 *     TicketStatusQuery:
 *       name: status
 *       in: query
 *       description: |
 *          Filter by one or multiple ticket statuses.
 *          You can pass a single value or a comma-separated list.
 *          Example: awaiting_evaluation,in_progress
 *       required: false
 *       schema:
 *         type: string
 *         example: "awaiting_evaluation,in_progress"
 */
