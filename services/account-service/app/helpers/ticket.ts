import { ICommentModel } from '@models/Comment';
import { ITicketModel } from '@models/Ticket';
import { JwtPayload } from 'jsonwebtoken';
import { ETicketStatus, isAdmin } from 'shared-types';

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

export const resolveAssigneeOnStatusChange = (status: ETicketStatus, ticket: ITicketModel) => {
  switch (status) {
    case ETicketStatus.AWAITING_EVALUATION:
    case ETicketStatus.AWAITING_PAYMENT:
      return ticket.createdBy._id;

    case ETicketStatus.IN_PROGRESS:
      const acceptedEvaluation = ticket.acceptedEvaluation;
      return acceptedEvaluation?.user ?? null;

    case ETicketStatus.SOLUTION_REVIEW:
      return ticket.createdBy._id;

    case ETicketStatus.MODERATOR_INVESTIGATION:
      return null;

    case ETicketStatus.COMPLETED:
    case ETicketStatus.CANCELED:
      return null;

    default:
      return null;
  }
};
