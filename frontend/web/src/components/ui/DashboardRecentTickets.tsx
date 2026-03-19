'use client';

import { ArrowRight } from 'lucide-react';
import { useGetTicketsMyQuery } from '@/api/accountApi';
import Typography from '../common/Typography';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { Skeleton } from '../shadcn/skeleton';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import DashboardTicketCard from './DashboardTicketCard';
import { TICKETS_PATH } from '@/constants/routes';
import Link from 'next/link';
import { Badge } from '../shadcn/badge';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import UserBadge from './UserBadge';
import { EUserRole } from '@shared/enums/role';
import { EUserBadgeVariant } from '@/enums/ui';

export default function DashboardRecentTickets() {
  const t = useTranslations();
  const { role, city, categoryName, isLoading: isLoadingUserState } = useSelector(selectUserData);

  const {
    data: getTicketsResponse,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    error
  } = useGetTicketsMyQuery({});

  useErrorHandler(error);

  const isLoadingTickets = isLoading || isFetching;
  const userTickets = getTicketsResponse?.data ?? [];

  return isError ? null : (
    <section className="space-y-3 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isUninitialized ? (
            <Skeleton className="h-[28px] w-[200px]" />
          ) : (
            <Typography variant="large" className="font-bold">
              {t('dashboard.recentTicketsHeader')}
            </Typography>
          )}

          {isLoadingUserState ? (
            <Skeleton className="h-[22px] w-[40px]" />
          ) : (
            <UserBadge
              variant={
                role === EUserRole.SPECIALIST ? EUserBadgeVariant.CATEGORY : EUserBadgeVariant.CITY
              }
              text={role === EUserRole.SPECIALIST ? categoryName : city}
            />
          )}

          {isLoadingUserState ? (
            <Skeleton className="h-[22px] w-[40px]" />
          ) : (
            <Badge variant="amount">
              {t('ticket.ticketsAmount', { count: userTickets.length ?? 0 })}
            </Badge>
          )}
        </div>

        {isUninitialized ? (
          <Skeleton className="h-[28px] w-[90px]" />
        ) : (
          <Link
            href={TICKETS_PATH}
            className="animation-base animation-idle animation-interactive flex items-center gap-1 rounded-xl p-2 text-xs font-bold"
          >
            <Typography variant="note-wide">{t('common.viewAll')}</Typography>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {userTickets.map((ticket, i) => (
            <DashboardTicketCard key={ticket._id} index={i} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  );
}
