import { TicketStatus } from '@/api/accountApi';
import {
  getTicketStatusColorClasses,
  getTicketStatusIcon,
  getTicketStatusTranslationKey
} from '@/lib/ticketUtils';
import { cn } from '@/lib/utils';
import Typography from '../common/Typography';
import { ETicketStatus } from '@shared/constants/enums';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  const Icon = getTicketStatusIcon(status);

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border p-2.5 shadow-sm',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      <Icon size={size} />

      {showStatusText ? (
        <Typography variant="note" className="text-center font-semibold">
          {t(getTicketStatusTranslationKey(status))}
        </Typography>
      ) : null}
    </div>
  );
}
