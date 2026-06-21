import { INotificationModel } from '@models/Notification';
import { Response } from 'express';

export const NotificationSSE = {
  clients: new Map<string, Response>(),
  addClient: (userId: string, res: Response) => {
    NotificationSSE.clients.set(userId, res);
  },
  removeClient: (userId: string) => {
    NotificationSSE.clients.delete(userId);
  },
  send: (userId: string, notification: INotificationModel) => {
    const client = NotificationSSE.clients.get(userId);

    if (client) {
      client.write(`data: ${JSON.stringify(notification)}\n\n`);
    }
  },
};
