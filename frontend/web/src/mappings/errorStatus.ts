import { EResponseStatus } from 'shared-types';
import { EErrorStrategy } from '@/enums/shared';

type TErrorMapping = {
  messageKey: string;
  strategy: EErrorStrategy;
};

export const ERROR_STATUS_MAP: Record<EResponseStatus, TErrorMapping> = {
  SERVER_ERROR: {
    messageKey: 'errors.generic',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_INVALID_TOKEN: {
    messageKey: 'errors.invalidToken',
    strategy: EErrorStrategy.REDIRECT
  },

  ERROR_TOKEN_NOT_FOUND: {
    messageKey: 'errors.tokenNotFound',
    strategy: EErrorStrategy.REDIRECT
  },

  ERROR_INVALID_LINK: {
    messageKey: 'errors.invalidLink',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_INVALID_DATA: {
    messageKey: 'errors.invalidData',
    strategy: EErrorStrategy.INLINE
  },

  ERROR_INVALID_CREDENTIALS: {
    messageKey: 'errors.invalidCredentials',
    strategy: EErrorStrategy.INLINE
  },

  ERROR_USER_NOT_FOUND: {
    messageKey: 'errors.userNotFound',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_USER_ALREADY_EXIST: {
    messageKey: 'errors.userAlreadyExists',
    strategy: EErrorStrategy.INLINE
  },

  ERROR_USER_NOT_VERIFIED: {
    messageKey: 'errors.userNotVerified',
    strategy: EErrorStrategy.SILENT
  },

  ERROR_EMAIL_SEND_FAILED: {
    messageKey: 'errors.emailFailed',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_CATEGORY_NOT_FOUND: {
    messageKey: 'errors.categoryNotFound',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_TICKET_NOT_FOUND: {
    messageKey: 'errors.ticketNotFound',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_EVALUATION_NOT_FOUND: {
    messageKey: 'errors.evaluationNotFound',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_TICKET_INVALID_STATUS: {
    messageKey: 'errors.invalidTicketStatus',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_TICKET_INVALID_STATUS_CHANGE: {
    messageKey: 'errors.invalidTicketStatusChange',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_TICKET_SPECIALIST_COMMENT_NOT_FOUND: {
    messageKey: 'errors.specialistCommentNotFound',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_TICKET_ALREADY_EVALUATED_BY_USER: {
    messageKey: 'errors.alreadyEvaluated',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_CATEGORY_HAS_ASSIGNED_SPECIALISTS: {
    messageKey: 'errors.categoryHasSpecialists',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_USER_ALREADY_ASSIGNED_TO_CATEGORY: {
    messageKey: 'errors.userAlreadyAssigned',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_CATEGORY_ALREADY_EXISTS: {
    messageKey: 'errors.categoryAlreadyExists',
    strategy: EErrorStrategy.INLINE
  },

  ERROR_USER_INVALID_ROLE: {
    messageKey: 'errors.invalidRole',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_USER_ALREADY_CATEGORIZED: {
    messageKey: 'errors.userAlreadyCategorized',
    strategy: EErrorStrategy.TOAST
  },

  ERROR_USER_NOT_ASSIGNED_TO_CATEGORY: {
    messageKey: 'errors.userNotAssignedToCategory',
    strategy: EErrorStrategy.TOAST
  }
};
