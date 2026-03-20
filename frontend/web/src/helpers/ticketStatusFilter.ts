import { ETicketStatus } from '@shared/enums/ticket';
import { EUserRole } from '@shared/enums/role';
import { ticketStatuses } from '@/constants/ticketStatus';

// My Evaluations page (specialist)
export const MY_EVALUATIONS_TICKETS_FILTERS = [
  ETicketStatus.AWAITING_PAYMENT,
  ETicketStatus.IN_PROGRESS,
  ETicketStatus.MODERATOR_INVESTIGATION,
  ETicketStatus.SOLUTION_REVIEW
] as const;

// Completed tickets page (user and specialist)
export const COMPLETED_TICKETS_FILTERS = [
  ETicketStatus.COMPLETED,
  ETicketStatus.CANCELLED
] as const;

// My Tickets page (user and specialist)
const MY_TICKETS_USER_FILTERS = [
  ETicketStatus.AWAITING_EVALUATION,
  ETicketStatus.AWAITING_PAYMENT,
  ETicketStatus.IN_PROGRESS,
  ETicketStatus.SOLUTION_REVIEW,
  ETicketStatus.MODERATOR_INVESTIGATION
] as const;

const MY_TICKETS_SPECIALIST_FILTERS = [
  ETicketStatus.AWAITING_PAYMENT,
  ETicketStatus.IN_PROGRESS,
  ETicketStatus.SOLUTION_REVIEW,
  ETicketStatus.MODERATOR_INVESTIGATION
] as const;

export const getMyTicketsFilters = (role: EUserRole): ETicketStatus[] => {
  switch (role) {
    case EUserRole.USER:
      return [...MY_TICKETS_USER_FILTERS];
    case EUserRole.SPECIALIST:
      return [...MY_TICKETS_SPECIALIST_FILTERS];
    default:
      return ticketStatuses;
  }
};
