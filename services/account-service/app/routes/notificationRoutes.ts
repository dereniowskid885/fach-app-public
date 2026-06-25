import {
  getUserNotifications,
  streamNotifications,
  deleteAllNotifications,
  deleteNotification,
} from '@controllers/notificationController';

import express from 'express';
const router = express.Router();

import { createMiddleware, checkAndParseAccessToken } from 'shared-backend';

// Auth middleware
const accessTokenMiddleware = createMiddleware(checkAndParseAccessToken, process.env.ACCESS_TOKEN_SECRET);
router.use(accessTokenMiddleware);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all user notifications
 *     description: Fetches all notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Successfully retrieved all notifications
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
router.get('/', getUserNotifications);

/**
 * @swagger
 * /notifications/stream:
 *   get:
 *     summary: Stream notifications via SSE
 *     description: Opens a Server-Sent Events connection to receive real-time notifications
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: SSE stream opened successfully
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Notification'
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
 */
router.get('/stream', streamNotifications);

/**
 * @swagger
 * /notifications/delete-all:
 *   delete:
 *     summary: Delete all notifications
 *     description: Delete all notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: All notifications deleted successfully
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
 *                   example: All notifications deleted successfully
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
router.delete('/delete-all', deleteAllNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete notification by ID
 *     description: Delete specific notification for the authenticated user
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the notification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
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
 *                   example: Notification deleted successfully
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
 *         description: Notification with provided ID not found or it is not related to current user
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
 *                   example: "ERROR_NOTIFICATION_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: Notification with provided ID not found or it is not related to current user
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
router.delete('/:id', deleteNotification);

export default router;
