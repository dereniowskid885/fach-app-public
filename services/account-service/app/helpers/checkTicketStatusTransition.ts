import { ETicketStatus } from '@shared/constants/enums';

// TODO: https://github.com/dereniowskid885/fach-app/issues/10
export const checkTicketStatusTransition = (fromStatus: string, toStatus: string) => {
  const allowedTransitions: Record<string, string[]> = {
    [ETicketStatus.AWAITING_EVALUATION]: [ETicketStatus.AWAITING_PAYMENT],
    [ETicketStatus.AWAITING_PAYMENT]: [ETicketStatus.IN_PROGRESS],
    [ETicketStatus.IN_PROGRESS]: [ETicketStatus.SOLUTION_REVIEW, ETicketStatus.MODERATOR_INVESTIGATION],
    [ETicketStatus.SOLUTION_REVIEW]: [ETicketStatus.COMPLETED],
    [ETicketStatus.MODERATOR_INVESTIGATION]: [
      ETicketStatus.AWAITING_EVALUATION,
      ETicketStatus.AWAITING_PAYMENT,
      ETicketStatus.SOLUTION_REVIEW,
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.COMPLETED,
      ETicketStatus.CANCELLED,
    ],
  };

  const allowedNextStatuses = allowedTransitions[fromStatus] || [];
  return allowedNextStatuses.includes(toStatus);
};
