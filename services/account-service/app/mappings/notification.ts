import { ENotificationType, ETicketStatus, EUserRole } from 'shared-types';

export const TICKET_NON_ADMIN_STATUS_CHANGE_NOTIFICATION = {
  [ETicketStatus.SOLUTION_REVIEW]: {
    notificationType: ENotificationType.SPECIALIST_SEND_FOR_REVIEW,
    recipientRole: EUserRole.USER,
    actorRole: EUserRole.SPECIALIST,
  },
  [ETicketStatus.COMPLETED]: {
    notificationType: ENotificationType.USER_SOLUTION_ACCEPTED,
    recipientRole: EUserRole.SPECIALIST,
    actorRole: EUserRole.USER,
  },
  [ETicketStatus.MODERATOR_INVESTIGATION]: {
    notificationType: ENotificationType.USER_SOLUTION_REJECTED,
    recipientRole: EUserRole.SPECIALIST,
    actorRole: EUserRole.USER,
  },
  // NON APPLICABLE
  [ETicketStatus.AWAITING_EVALUATION]: null,
  [ETicketStatus.AWAITING_PAYMENT]: null,
  [ETicketStatus.CANCELED]: null,
  [ETicketStatus.IN_PROGRESS]: null,
};
