import { TicketStatus } from '@/api/accountApi';
import { getTicketStatusColorClasses, getTicketStatusIcon } from '@/constants/ticketStatus';
import { cn } from '@/lib/utils';
import { Typography } from '../common/Typography';
import { ETicketStatus } from '@shared/constants/enums';

export interface ITicketStatusIcon {
  status?: TicketStatus | ETicketStatus;
  size?: number;
  className?: string;
  showStatusText?: boolean;
}

export default function TicketStatusIcon({
  status,
  size = 20,
  className,
  showStatusText = false
}: ITicketStatusIcon) {
  const Icon = getTicketStatusIcon(status);

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border p-2.5',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      <Icon size={size} />

      {showStatusText ? (
        <Typography variant="note" className="font-semibold">
          {status}
        </Typography>
      ) : null}
    </div>
  );
}
