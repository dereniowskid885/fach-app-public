import { TicketStatus } from '@/services/api/generated/accountApi';
import { ticketStatusObj } from '@/constants/ticketStatus';
import { ETicketStatus } from '@shared/enums/ticket';
import { ClipboardList } from 'lucide-react';

export const getTicketStatusColorClasses = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].className : 'bg-blue-50 text-blue-600 border-blue-100';
};

export const getTicketStatusIcon = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].icon : ClipboardList;
};

export const getTicketStatusTranslationKey = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].translationKey : 'ticketStatus.unknown';
};
