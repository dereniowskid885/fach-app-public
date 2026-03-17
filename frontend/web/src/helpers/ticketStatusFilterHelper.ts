import { ETicketStatus, EUserRole } from '@shared/constants/enums';

export const TicketStatusFilterHelper = {
  getMyTicketsFilters: (role: EUserRole) => {
    switch (role) {
      case EUserRole.USER:
        return [
          ETicketStatus.AWAITING_EVALUATION,
          ETicketStatus.AWAITING_PAYMENT,
          ETicketStatus.IN_PROGRESS,
          ETicketStatus.SOLUTION_REVIEW,
          ETicketStatus.MODERATOR_INVESTIGATION
        ];

      case EUserRole.SPECIALIST:
        return [
          ETicketStatus.AWAITING_PAYMENT,
          ETicketStatus.IN_PROGRESS,
          ETicketStatus.SOLUTION_REVIEW,
          ETicketStatus.MODERATOR_INVESTIGATION
        ];

      default:
        return [];
    }
  },
  getCompletedTicketsFilters: () => {
    return [ETicketStatus.COMPLETED, ETicketStatus.CANCELLED];
  },
  getMyEvaluationsTicketsFilters: () => {
    return [
      ETicketStatus.AWAITING_PAYMENT,
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.MODERATOR_INVESTIGATION,
      ETicketStatus.SOLUTION_REVIEW
    ];
  }
};
