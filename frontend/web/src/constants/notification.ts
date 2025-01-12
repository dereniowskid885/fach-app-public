// TODO: temporary enum - to be discussed
export enum ENotificationType {
  RESPONSE = 'RESPONSE',
  STATUS = 'STATUS',
  NEW = 'NEW'
}

export interface INotification {
  id: string;
  ticketId: string;
  type: ENotificationType;
  user: string;
  message: string;
  time: string;
}
