import { ETicketStatus } from '@shared/constants/enums';

export interface IGetTicketsFilter {
  category?: string;
  city?: string;
  status?: ETicketStatus;
  assignee?: string;
  createdBy?: string;
}
