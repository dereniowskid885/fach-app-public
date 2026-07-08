import {
  ALL_TICKETS_PATH,
  AVAILABLE_TICKETS_PATH,
  COMPLETED_TICKETS_PATH,
  EVALUATIONS_PATH,
  HOME_PATH,
  TICKETS_PATH
} from '@/constants/routes';

export const NOTIFICATION_UPDATE_QUERY_ENDPOINTS_MAP: Record<string, string> = {
  [HOME_PATH]: 'getTicketsMyInfinite',
  [TICKETS_PATH]: 'getTicketsMyInfinite',
  [COMPLETED_TICKETS_PATH]: 'getTicketsCompletedInfinite',
  [ALL_TICKETS_PATH]: 'getTicketsInfinite',
  [AVAILABLE_TICKETS_PATH]: 'getTicketsSpecialistAvailableInfinite',
  [EVALUATIONS_PATH]: 'getTicketsSpecialistEvaluationsInfinite'
};
