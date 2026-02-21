import { TicketStatus } from '@/api/accountApi';
import {
  ETicketStatus,
  getTicketStatusColorClasses,
  getTicketStatusIcon
} from '@/constants/ticketStatus';
import { cn } from '@/lib/utils';

export interface ITicketStatusIcon {
  status?: TicketStatus | ETicketStatus;
  size?: number;
  className?: string;
}

export default function TicketStatusIcon({ status, size = 20, className }: ITicketStatusIcon) {
  const Icon = getTicketStatusIcon(status);

  return (
    <div className={cn('rounded-xl border p-2.5', getTicketStatusColorClasses(status), className)}>
      <Icon size={size} />
    </div>
  );
}
