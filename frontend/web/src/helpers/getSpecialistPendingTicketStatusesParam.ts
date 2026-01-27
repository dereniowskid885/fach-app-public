import { ETicketStatus } from '@/constants/ticketStatus';

export const getSpecialistPendingTicketStatusesParam = () =>
  `${ETicketStatus.PRICE_EVALUATION},${ETicketStatus.PRICE_USER_ACCEPTATION}`;
