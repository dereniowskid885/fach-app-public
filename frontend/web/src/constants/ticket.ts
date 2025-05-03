import { GetTicketsByIdByIdApiResponse } from '@/api/accountApi';
import { ETicketStatus } from './ticketStatus';

export interface ITicket {
  _id: string;
  category: GetTicketsByIdByIdApiResponse['category'];
  status: ETicketStatus;
  assignee: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  price: string;
  title: string;
  description: string;
}
