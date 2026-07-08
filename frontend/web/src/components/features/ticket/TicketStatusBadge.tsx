import { TicketStatus } from '@/services/api/generated/accountApi';
import { getTicketStatusColorClasses, getTicketStatusTranslationKey } from '@/helpers/ticket';
import { cn } from '@/lib/utils';
import { ETicketStatus } from 'shared-types';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/shadcn/badge';

export interface ITicketStatusBadge {
  className?: string;
  status?: TicketStatus | ETicketStatus;
}

export default function TicketStatusBadge({ className, status }: ITicketStatusBadge) {
  const t = useTranslations();

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-nowrap shadow-md',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      {t(getTicketStatusTranslationKey(status))}
    </Badge>
  );
}
