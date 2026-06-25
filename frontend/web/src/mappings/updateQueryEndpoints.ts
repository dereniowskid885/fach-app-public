import {
  ALL_TICKETS_PATH,
  AVAILABLE_TICKETS_PATH,
  COMPLETED_TICKETS_PATH,
  EVALUATIONS_PATH,
  HOME_PATH,
  TICKETS_PATH
} from '@/constants/routes';

export const NOTIFICATION_UPDATE_QUERY_ENDPOINTS_MAP: Record<string, string> = {
  [HOME_PATH]: 'getTicketsMy',
  [TICKETS_PATH]: 'getTicketsMy',
  [COMPLETED_TICKETS_PATH]: 'getTicketsCompleted',
  [ALL_TICKETS_PATH]: 'getTickets',
  [AVAILABLE_TICKETS_PATH]: 'getTicketsSpecialistAvailable',
  [EVALUATIONS_PATH]: 'getTicketsSpecialistEvaluations'
};
