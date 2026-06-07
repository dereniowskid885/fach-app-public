'use client';

import { ArrowRight, ClipboardList, RotateCcw } from 'lucide-react';
import { useGetTicketsMyQuery } from '@/services/api/generated/accountApi';
import Typography from '@/components/ui/Typography';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import TicketCard from '@/components/features/ticket/TicketCard';
import { ALL_TICKETS_PATH, TICKETS_PATH } from '@/constants/routes';
import Link from 'next/link';
import { Badge } from '@/components/shadcn/badge';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import IconBadge from '@/components/ui/IconBadge';
import { EIconBadgeVariant } from '@/enums/ui';
import { isAdmin, isSpecialist } from 'shared-types';
import ContentSection from '@/components/ui/ContentSection';
import { Button } from '@/components/shadcn/button';

export default function DashboardRecentTickets() {
  const t = useTranslations();
  const { role, city, categoryName, isLoading: isLoadingUserState } = useSelector(selectUserData);

  const {
    data: getTicketsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetTicketsMyQuery({});

  useErrorHandler(error);

  const isLoadingTickets = isLoading || isFetching;
  const userTickets = getTicketsResponse?.data ?? [];

  return isError ? null : (
    <section className="space-y-3 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Typography variant="large" className="font-bold">
            {t('dashboard.recentTicketsHeader')}
          </Typography>

          {isAdmin(role) ? null : isLoadingUserState ? (
            <Skeleton className="h-5 w-10" />
          ) : (
            <IconBadge
              variant={isSpecialist(role) ? EIconBadgeVariant.CATEGORY : EIconBadgeVariant.CITY}
              text={isSpecialist(role) ? categoryName : city}
            />
          )}

          {isLoadingUserState ? (
            <Skeleton className="h-5 w-10" />
          ) : (
            <Badge variant="amount">
              {t('ticket.ticketsAmount', { count: userTickets.length ?? 0 })}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="animation-hover" onClick={refetch}>
            <RotateCcw size={12} />
          </Button>

          <Link
            href={isAdmin(role) ? ALL_TICKETS_PATH : TICKETS_PATH}
            className="animation-hover flex items-center gap-1 rounded-2xl p-2 text-xs font-bold"
          >
            <Typography variant="note-wide">{t('common.viewAll')}</Typography>

            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : userTickets.length === 0 ? (
        <ContentSection className="m-auto flex w-fit flex-col items-center justify-center p-6">
          <ClipboardList size={28} className="text-muted-foreground/70" />

          <Typography variant="p" className="text-muted-foreground/70">
            {t('dashboard.recentTicketsEmpty')}
          </Typography>

          <Button variant="secondary" onClick={refetch}>
            <RotateCcw size={12} />

            {t('common.refresh')}
          </Button>
        </ContentSection>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {userTickets.map((ticket, i) => (
            <TicketCard key={ticket._id} index={i} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  );
}
