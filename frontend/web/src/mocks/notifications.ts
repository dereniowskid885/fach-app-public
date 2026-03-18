import { ENotificationType } from '@/enums/notification';
import { INotification } from '@/types/notification';

export const notifications: INotification[] = [
  {
    id: '1',
    type: ENotificationType.RESPONSE,
    user: 'Andrzej Piechuta',
    time: '2 minuty temu',
    ticketId: '#4321',
    message: 'Odpowiedział na Twoją sprawę'
  },
  {
    id: '2',
    type: ENotificationType.STATUS,
    user: 'Marek Kowalski',
    time: '1 godzinę temu',
    ticketId: '#4322',
    message: 'Zmienił status sprawy na "W realizacji"'
  },
  {
    id: '3',
    type: ENotificationType.NEW,
    user: 'Jan Nowak',
    time: '2 godziny temu',
    ticketId: '#4323',
    message: 'Został przypisany do twojej sprawy'
  }
];
