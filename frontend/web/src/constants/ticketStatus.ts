import { TicketStatus } from '@/api/accountApi';
import { ETicketStatus } from '@shared/constants/enums';
import {
  CheckCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  PlayCircle,
  Search
} from 'lucide-react';

export const ticketStatusObj = {
  [ETicketStatus.PRICE_EVALUATION]: {
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-600 border-yellow-100'
  },
  [ETicketStatus.PRICE_USER_ACCEPTATION]: {
    icon: CheckCircle,
    className: 'bg-teal-50 text-teal-600 border-teal-100'
  },
  [ETicketStatus.PENDING_PAYMENT]: {
    icon: CreditCard,
    className: 'bg-purple-50 text-purple-600 border-purple-100'
  },
  [ETicketStatus.IN_PROGRESS]: {
    icon: PlayCircle,
    className: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  [ETicketStatus.SOLUTION_USER_APPROVAL]: {
    icon: CheckCircle2,
    className: 'bg-lime-50 text-lime-600 border-lime-100'
  },
  [ETicketStatus.MODERATOR_INVESTIGATION]: {
    icon: Search,
    className: 'bg-orange-50 text-orange-600 border-orange-100'
  },
  [ETicketStatus.COMPLETED]: {
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  }
};

export const getTicketStatusColorClasses = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].className : 'bg-blue-50 text-blue-600 border-blue-100';
};

export const getTicketStatusIcon = (status?: TicketStatus | ETicketStatus) => {
  return status ? ticketStatusObj[status].icon : ClipboardList;
};
