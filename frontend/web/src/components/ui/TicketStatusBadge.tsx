import { TicketStatus } from '@/api/accountApi';
import { getTicketStatusColorClasses } from '@/constants/ticketStatus';
import { cn } from '@/lib/utils';
import { ETicketStatus } from '@shared/constants/enums';

export interface ITicketStatusBadge {
  className?: string;
  status?: TicketStatus | ETicketStatus;
}

export default function TicketStatusBadge({ className, status }: ITicketStatusBadge) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      {status}
    </div>
  );
}
