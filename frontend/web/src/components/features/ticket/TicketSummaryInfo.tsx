import { Ticket } from '@/services/api/generated/accountApi';
import Typography from '@/components/ui/Typography';
import TicketStatusIcon from './TicketStatusIcon';
import { cn } from '@/utils/shared';
import TicketDetailsDialog from './TicketDetailsDialog';
import { useState } from 'react';

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
  const [ticketDetailsDialog, setTicketDetailsDialog] = useState<boolean>(false);

  return (
    <>
      <div className={cn('flex cursor-pointer items-center gap-4', className)}>
        {showStatusIcon ? <TicketStatusIcon status={ticket.status} /> : null}

        <div className="group space-y-0.5" onClick={() => setTicketDetailsDialog(true)}>
          <Typography
            variant="muted"
            className="line-clamp-1 font-bold text-primary group-hover:underline"
          >
            {ticket.title}
          </Typography>

          <Typography variant="small" className="line-clamp-2 text-muted-foreground">
            {ticket.description}
          </Typography>
        </div>
      </div>

      <TicketDetailsDialog
        open={ticketDetailsDialog}
        ticket={ticket}
        closeDialog={() => setTicketDetailsDialog(false)}
      />
    </>
  );
}
