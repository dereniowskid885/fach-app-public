import { ETicketStatus, EUserRole, isAdmin } from 'shared-types';
import { ticketStatuses } from '@/constants/ticketStatus';
import {
  COMPLETED_TICKETS_FILTERS,
  MY_TICKETS_SPECIALIST_FILTERS,
  MY_TICKETS_USER_FILTERS
} from '@/constants/filters';
import { TicketStatus } from '@/services/api/generated/accountApi';
import { ticketStatusObj } from '@/constants/ticketStatus';
import { ClipboardList } from 'lucide-react';

// Ticket Status Filters
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

// Ticket Status
export const getTicketStatusColorClasses = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].className : 'bg-blue-50 text-blue-600 border-blue-100';
};

export const getTicketStatusIcon = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].icon : ClipboardList;
};

export const getTicketStatusTranslationKey = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].translationKey : 'ticketStatus.unknown';
};

// Ticket Details Comment Input
export const isCommentingAllowed = (role: EUserRole, status?: TicketStatus | ETicketStatus) => {
  const isAdminRole = isAdmin(role);

  if (isAdminRole) return true;

  switch (status) {
    case ETicketStatus.IN_PROGRESS || ETicketStatus.SOLUTION_REVIEW:
      return true;

    case ETicketStatus.AWAITING_EVALUATION ||
      ETicketStatus.AWAITING_PAYMENT ||
      ETicketStatus.CANCELED ||
      ETicketStatus.COMPLETED ||
      ETicketStatus.MODERATOR_INVESTIGATION:
      return false;

    default:
      return false;
  }
};
