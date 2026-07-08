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
 *     CursorQuery:
 *       name: cursor
 *       in: query
 *       required: false
 *       description: Cursor for pagination (ID of the last item from the previous page)
 *       schema:
 *         type: string
 *       example: "64f3b12a6f4c1e9d3a7b5678"
 *     LimitQuery:
 *       name: limit
 *       in: query
 *       required: false
 *       description: Maximum number of items to return (default 20, max 100)
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 20
 *       example: 20
 */
