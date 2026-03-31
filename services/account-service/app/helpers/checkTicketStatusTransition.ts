import { ETicketStatus } from 'shared-types';

// TODO: https://github.com/dereniowskid885/fach-app/issues/10
export const checkTicketStatusTransition = (fromStatus: string, toStatus: string) => {
  const allowedTransitions: Record<string, string[]> = {
    [ETicketStatus.AWAITING_EVALUATION]: [ETicketStatus.AWAITING_PAYMENT, ETicketStatus.CANCELED],
    [ETicketStatus.AWAITING_PAYMENT]: [ETicketStatus.IN_PROGRESS],
    [ETicketStatus.IN_PROGRESS]: [ETicketStatus.SOLUTION_REVIEW],
    [ETicketStatus.SOLUTION_REVIEW]: [ETicketStatus.COMPLETED],
  };

  const allowedNextStatuses = allowedTransitions[fromStatus] || [];
  return allowedNextStatuses.includes(toStatus);
};
