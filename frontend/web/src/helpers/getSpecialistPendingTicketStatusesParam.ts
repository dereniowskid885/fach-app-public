import { ETicketStatus } from '@shared/constants/enums';

export const getSpecialistPendingTicketStatusesParam = () =>
  `${ETicketStatus.PRICE_EVALUATION},${ETicketStatus.PRICE_USER_ACCEPTATION}`;
