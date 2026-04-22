import { TicketStatus } from '@/services/api/generated/accountApi';
import {
  getTicketStatusColorClasses,
  getTicketStatusIcon,
  getTicketStatusTranslationKey
} from '@/helpers/ticket';
import { cn } from '@/utils/shared';
import Typography from '../common/Typography';
import { ETicketStatus } from 'shared-types';
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
        <Typography variant="note" className="text-nowrap text-center font-semibold">
          {t(getTicketStatusTranslationKey(status))}
        </Typography>
      ) : null}
    </div>
  );
}
