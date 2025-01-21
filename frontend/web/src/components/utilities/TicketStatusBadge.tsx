import { Badge } from '@/components/shadcn/badge';
import { ETicketStatus } from '@/constants/ticket';

const getStatusBgColor = (status: ETicketStatus): string => {
  switch (status) {
    case ETicketStatus.PRICE_EVALUATION:
      return 'bg-secondary';
    case ETicketStatus.PRICE_USER_ACCEPTATION:
      return 'bg-secondary-600';
    case ETicketStatus.PENDING_PAYMENT:
      return 'bg-accent-400';
    case ETicketStatus.IN_PROGRESS:
      return 'bg-primary-500';
    case ETicketStatus.SOLUTION_USER_APPROVAL:
      return 'bg-warning-500';
    case ETicketStatus.MODERATOR_INVESTIGATION:
      return 'bg-neutral-500';
    case ETicketStatus.COMPLETED:
      return 'bg-success-500';
  }
};

export interface ITicketStatusBadge {
  className?: string;
  status: ETicketStatus;
}

export default function TicketStatusBadge({ className, status }: ITicketStatusBadge) {
  return (
    <Badge variant="outline" className={`w-fit ${getStatusBgColor(status)} ${className}`}>
      {status}
    </Badge>
  );
}
