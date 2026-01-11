import { ETicketStatus } from '@shared/constants/enums';

export interface IGetTicketsFilter {
  categoryId?: string;
  city?: string;
  status?: ETicketStatus;
  assignee?: string;
  createdBy?: string;
}
