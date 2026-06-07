import { Ticket } from '@/services/api/generated/accountApi';
import Typography from '@/components/ui/Typography';
import TicketStatusIcon from './TicketStatusIcon';
import { cn } from '@/lib/utils';
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
            className="text-foreground line-clamp-1 font-semibold group-hover:underline"
          >
            {ticket.title}
          </Typography>

          <Typography variant="small" className="text-muted-foreground line-clamp-2">
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
