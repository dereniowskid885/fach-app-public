import { NotificationManager } from '@managers/notificationManager';
import { NotificationSSE } from '@sse/notification';
import { FilterBuilder } from '@utils/filterBuilder';
import type { Request, Response } from 'express';
import { handleAppError, IAppError } from 'shared-backend';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const pagination = FilterBuilder.getPagination(req);
    const { data, nextCursor, hasNextPage } = await NotificationManager.getUserNotifications(
      req.user.userId,
      pagination,
    );

    return res.status(200).json({ success: true, dataLength: data.length, nextCursor, hasNextPage, data });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const getUserNotificationsCount = async (req: Request, res: Response) => {
  try {
    const count = await NotificationManager.getUserNotificationsCount(req.user.userId);

    return res.status(200).json({ success: true, count });
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

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await NotificationManager.deleteNotification(req.params.id as string, req.user.userId);

    return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    await NotificationManager.deleteAllNotifications(req.user.userId);

    return res.status(200).json({ success: true, message: 'All user notifications deleted successfully' });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
