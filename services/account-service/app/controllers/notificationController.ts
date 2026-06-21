import { NotificationManager } from '@managers/notificationManager';
import { NotificationSSE } from '@sse/notification';
import { FilterBuilder } from '@utils/filterBuilder';
import type { Request, Response } from 'express';
import { handleAppError, IAppError } from 'shared-backend';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const filter = FilterBuilder.getNotifications(req, req.user);
    const { notifications, unreadCount } = await NotificationManager.getUserNotifications(filter);

    return res.status(200).json({ success: true, dataLength: notifications.length, data: notifications, unreadCount });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const streamNotifications = (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    NotificationSSE.addClient(userId, res);

    const keepAlive = setInterval(() => {
      res.write(': ping\n\n');
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAlive);

      NotificationSSE.removeClient(userId);
    });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationManager.markAsRead(req.params.id as string, req.user.userId);

    return res
      .status(200)
      .json({ success: true, message: 'Notification successfully marked as read', data: notification });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    await NotificationManager.markAllAsRead(req.user.userId);

    return res.status(200).json({ success: true, message: 'All user notifications successfully marked as read' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
