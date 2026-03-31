import { ETicketStatus } from 'shared-types';
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  PlayCircle,
  Search,
  XCircle
} from 'lucide-react';

export const ticketStatuses = Object.values(ETicketStatus);

export const ticketStatusObj = {
  [ETicketStatus.AWAITING_EVALUATION]: {
    icon: Clock,
    className: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:text-yellow-600',
    translationKey: 'ticketStatus.awaitingEvaluation'
  },
  [ETicketStatus.AWAITING_PAYMENT]: {
    icon: CreditCard,
    className: 'bg-purple-50 text-purple-600 dark:text-purple-600 border-purple-200',
    translationKey: 'ticketStatus.awaitingPayment'
  },
  [ETicketStatus.IN_PROGRESS]: {
    icon: PlayCircle,
    className: 'bg-blue-50 text-blue-600 dark:text-blue-600 border-blue-200',
    translationKey: 'ticketStatus.inProgress'
  },
  [ETicketStatus.SOLUTION_REVIEW]: {
    icon: CheckCircle2,
    className: 'bg-lime-50 text-lime-600 dark:text-lime-600 border-lime-200',
    translationKey: 'ticketStatus.solutionReview'
  },
  [ETicketStatus.MODERATOR_INVESTIGATION]: {
    icon: Search,
    className: 'bg-orange-50 text-orange-600 dark:text-orange-600 border-orange-200',
    translationKey: 'ticketStatus.moderatorInvestigation'
  },
  [ETicketStatus.COMPLETED]: {
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-600 dark:text-emerald-600 border-emerald-200',
    translationKey: 'ticketStatus.completed'
  },
  [ETicketStatus.CANCELED]: {
    icon: XCircle,
    className: 'bg-red-50 text-red-600 dark:text-red-600 border-red-200',
    translationKey: 'ticketStatus.canceled'
  }
};
