import { TicketStatus } from '@/services/api/generated/accountApi';
import { getTicketStatusColorClasses, getTicketStatusTranslationKey } from '@/utils/ticket';
import { cn } from '@/utils/shared';
import { ETicketStatus } from '@shared/enums/ticket';
import { useTranslations } from 'next-intl';
import { Badge } from '../shadcn/badge';

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
        'inline-flex items-center text-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-md',
        getTicketStatusColorClasses(status),
        className
      )}
    >
      {t(getTicketStatusTranslationKey(status))}
    </Badge>
  );
}
