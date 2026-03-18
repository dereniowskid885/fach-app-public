import { ENotificationType } from '@/enums/notification';

// TODO: temporary interface
export interface INotification {
  id: string;
  ticketId: string;
  type: ENotificationType;
  user: string;
  message: string;
  time: string;
}
