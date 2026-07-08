import { COMPLETED_TICKETS_PATH, ROUTES, TICKETS_PATH } from '@/constants/routes';
import { NotificationType } from '@/services/api/generated/accountApi';
import { ENotificationType, ESupportedLanguages } from 'shared-types';

export const getNotificationLinkByType = (
  currentLang: ESupportedLanguages,
  type?: ENotificationType | NotificationType
) => {
  switch (type) {
    case ENotificationType.USER_EVALUATION_ACCEPTED:
      return ROUTES[TICKETS_PATH][currentLang];
    case ENotificationType.USER_SOLUTION_ACCEPTED:
      return ROUTES[COMPLETED_TICKETS_PATH][currentLang];
    default:
      return;
  }
};
