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
 *          Example: Wycena,Oczekiwanie na płatność
 *       required: false
 *       schema:
 *         type: string
 *         example: "Wycena,Oczekiwanie na płatność"
 */
