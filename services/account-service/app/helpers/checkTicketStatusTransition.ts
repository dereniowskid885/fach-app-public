import { ETicketStatus } from '@shared/constants/enums';

// TODO: https://github.com/dereniowskid885/fach-app/issues/10
export const checkTicketStatusTransition = (fromStatus: string, toStatus: string) => {
  const allowedTransitions: Record<string, string[]> = {
    [ETicketStatus.PRICE_EVALUATION]: [ETicketStatus.PRICE_USER_ACCEPTATION],
    // ETicketStatus.PRICE_USER_ACCEPTATION on the right side to allow other specialist to evaluate ticket, which have evaluation already
    [ETicketStatus.PRICE_USER_ACCEPTATION]: [ETicketStatus.PENDING_PAYMENT, ETicketStatus.PRICE_USER_ACCEPTATION],
    [ETicketStatus.PENDING_PAYMENT]: [ETicketStatus.IN_PROGRESS],
    [ETicketStatus.IN_PROGRESS]: [ETicketStatus.SOLUTION_USER_APPROVAL, ETicketStatus.MODERATOR_INVESTIGATION],
    [ETicketStatus.SOLUTION_USER_APPROVAL]: [ETicketStatus.COMPLETED],
    [ETicketStatus.MODERATOR_INVESTIGATION]: [
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.COMPLETED,
      ETicketStatus.PRICE_EVALUATION,
    ],
  };

  const allowedNextStatuses = allowedTransitions[fromStatus] || [];
  return allowedNextStatuses.includes(toStatus);
};
