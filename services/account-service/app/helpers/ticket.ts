import { ICommentModel } from '@models/Comment';
import { ITicketModel } from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ETicketStatus, isAdmin } from 'shared-types';

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

export const canViewTicketComments = (user: JwtPayload, ticket: ITicketModel) => {
  const isAdminRole = isAdmin(user.role);

  if (isAdminRole) return true;

  const isTicketOwner = user.userId === ticket.createdBy.id;
  const isAcceptedSpecialist = user.userId === ticket.acceptedEvaluation.user.id;

  return isTicketOwner || isAcceptedSpecialist;
};

export const canDeleteTicketComment = (user: JwtPayload, comment: ICommentModel) => {
  const isAdminRole = isAdmin(user.role);
  const isCommentCreator = user.userId === comment.user.id;

  return isAdminRole || isCommentCreator;
};
