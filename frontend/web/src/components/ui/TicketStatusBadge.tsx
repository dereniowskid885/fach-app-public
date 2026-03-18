import { TicketStatus } from '@/api/accountApi';
import { getTicketStatusColorClasses, getTicketStatusTranslationKey } from '@/utils/ticket';
import { cn } from '@/utils/shared';
import { ETicketStatus } from '@shared/enums/ticket';
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
