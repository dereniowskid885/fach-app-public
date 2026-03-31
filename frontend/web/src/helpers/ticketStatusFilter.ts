import { ETicketStatus, EUserRole } from 'shared-types';
import { ticketStatuses } from '@/constants/ticketStatus';
import {
  COMPLETED_TICKETS_FILTERS,
  MY_TICKETS_SPECIALIST_FILTERS,
  MY_TICKETS_USER_FILTERS
} from '@/constants/filters';

export const getMyTicketsStatusFilters = (role: EUserRole | string): ETicketStatus[] => {
  switch (role) {
    case EUserRole.USER:
      return [...MY_TICKETS_USER_FILTERS];
    case EUserRole.SPECIALIST:
      return [...MY_TICKETS_SPECIALIST_FILTERS];
    default:
      return [];
  }
};

export const getAllTicketsStatusFilters = () => ticketStatuses;

export const getCompletedTicketsStatusFilters = () => [...COMPLETED_TICKETS_FILTERS];
