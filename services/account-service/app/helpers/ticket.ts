import { ICommentModel } from '@models/Comment';
import { ITicketModel } from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ETicketStatus, EUserRole, isAdmin } from 'shared-types';

export const checkTicketStatusTransition = (
  fromStatus: ETicketStatus,
  toStatus: ETicketStatus,
  role: EUserRole,
): boolean => {
  const allowedTransitions: Partial<Record<ETicketStatus, Partial<Record<EUserRole, ETicketStatus[]>>>> = {
    [ETicketStatus.AWAITING_EVALUATION]: {
      [EUserRole.USER]: [ETicketStatus.CANCELED],
      [EUserRole.ADMIN]: [
        ETicketStatus.AWAITING_PAYMENT,
        ETicketStatus.CANCELED,
        ETicketStatus.MODERATOR_INVESTIGATION,
      ],
    },
    [ETicketStatus.AWAITING_PAYMENT]: {
      [EUserRole.ADMIN]: [ETicketStatus.IN_PROGRESS, ETicketStatus.CANCELED, ETicketStatus.MODERATOR_INVESTIGATION],
    },
    [ETicketStatus.IN_PROGRESS]: {
      [EUserRole.SPECIALIST]: [ETicketStatus.SOLUTION_REVIEW],
      [EUserRole.ADMIN]: [ETicketStatus.SOLUTION_REVIEW, ETicketStatus.CANCELED, ETicketStatus.MODERATOR_INVESTIGATION],
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
      ],
    },
  };

  const allowedForRole = allowedTransitions[fromStatus]?.[role] ?? [];
  return allowedForRole.includes(toStatus);
};

export const canViewTicketComments = (user: JwtPayload, ticket: ITicketModel) => {
  const isAdminRole = isAdmin(user.role);

  if (isAdminRole) return true;

  const isTicketOwner = user.userId === ticket.createdBy.id;
  const isAcceptedSpecialist = user.userId === ticket.acceptedEvaluation?.user.id;

  return isTicketOwner || isAcceptedSpecialist;
};

export const canDeleteTicketComment = (user: JwtPayload, comment: ICommentModel) => {
  const isAdminRole = isAdmin(user.role);
  const isCommentCreator = user.userId === comment.user.id;

  return isAdminRole || isCommentCreator;
};
