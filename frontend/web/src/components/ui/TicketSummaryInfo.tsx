import { Ticket } from '@/api/accountApi';
import Typography from '../common/Typography';
import TicketStatusIcon from './TicketStatusIcon';
import { cn } from '@/utils/shared';

export interface ITicketSummaryInfo {
  ticket: Ticket;
  className?: string;
  showStatusIcon?: boolean;
}

export default function TicketSummaryInfo({
  ticket,
  className,
  showStatusIcon = false
}: ITicketSummaryInfo) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {showStatusIcon ? <TicketStatusIcon status={ticket.status} /> : null}

      <div className="space-y-0.5">
        <Typography variant="muted" className="line-clamp-1 font-bold text-primary">
          {ticket.title}
        </Typography>

        <Typography variant="small" className="line-clamp-2 text-muted-foreground">
          {ticket.description}
        </Typography>
      </div>
    </div>
  );
}
