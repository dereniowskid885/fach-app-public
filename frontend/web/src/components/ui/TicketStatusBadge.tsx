import { TicketStatus } from '@/api/accountApi';
import { getTicketStatusColorClasses, getTicketStatusTranslationKey } from '@/lib/ticketUtils';
import { cn } from '@/lib/utils';
import { ETicketStatus } from '@shared/constants/enums';
import { useTranslations } from 'next-intl';

export interface ITicketStatusBadge {
  className?: string;
  status?: TicketStatus | ETicketStatus;
}

export default function TicketStatusBadge({ className, status }: ITicketStatusBadge) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        'inline-flex items-center text-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-md',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      {t(getTicketStatusTranslationKey(status))}
    </div>
  );
}
