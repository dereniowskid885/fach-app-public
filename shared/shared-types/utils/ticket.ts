import { ETicketStatus, EUserRole } from "../enums";

export const allowedTicketTransitions: Partial<
  Record<ETicketStatus, Partial<Record<EUserRole, ETicketStatus[]>>>
> = {
  [ETicketStatus.AWAITING_EVALUATION]: {
    [EUserRole.USER]: [ETicketStatus.CANCELED],
    [EUserRole.ADMIN]: [
      ETicketStatus.AWAITING_PAYMENT,
      ETicketStatus.CANCELED,
      ETicketStatus.MODERATOR_INVESTIGATION,
    ],
  },
  [ETicketStatus.AWAITING_PAYMENT]: {
    [EUserRole.ADMIN]: [
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.CANCELED,
      ETicketStatus.MODERATOR_INVESTIGATION,
    ],
  },
  [ETicketStatus.IN_PROGRESS]: {
    [EUserRole.SPECIALIST]: [ETicketStatus.SOLUTION_REVIEW],
    [EUserRole.ADMIN]: [
      ETicketStatus.SOLUTION_REVIEW,
      ETicketStatus.CANCELED,
      ETicketStatus.MODERATOR_INVESTIGATION,
    ],
  },
  [ETicketStatus.SOLUTION_REVIEW]: {
    [EUserRole.USER]: [ETicketStatus.COMPLETED, ETicketStatus.MODERATOR_INVESTIGATION],
    [EUserRole.ADMIN]: [
      ETicketStatus.COMPLETED,
      ETicketStatus.CANCELED,
      ETicketStatus.MODERATOR_INVESTIGATION,
      ETicketStatus.IN_PROGRESS,
    ],
  },
  [ETicketStatus.MODERATOR_INVESTIGATION]: {
    [EUserRole.ADMIN]: [
      ETicketStatus.COMPLETED,
      ETicketStatus.IN_PROGRESS,
      ETicketStatus.CANCELED,
      ETicketStatus.AWAITING_PAYMENT,
      ETicketStatus.AWAITING_EVALUATION,
    ],
  },
};

export const checkTicketStatusTransition = (
  fromStatus: ETicketStatus,
  toStatus: ETicketStatus,
  role: EUserRole,
): boolean => {
  const allowedForRole = allowedTicketTransitions[fromStatus]?.[role] ?? [];

  return allowedForRole.includes(toStatus);
};
