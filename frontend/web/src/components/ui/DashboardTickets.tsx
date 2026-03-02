import { ArrowRight } from 'lucide-react';
import { Button } from '../shadcn/button';
import { motion } from 'framer-motion';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { Category, useGetTicketsQuery } from '@/api/accountApi';
import { Typography } from '../common/Typography';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { Skeleton } from '../shadcn/skeleton';
import { Badge } from '../shadcn/badge';
import TicketCategoriesFilter from './TicketCategoriesFilter';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import DashboardTicketCard from './DashboardTicketCard';

export default function DashoardTickets() {
  const t = useTranslations();
  const { role, userId } = useAppSelector(selectUserData);
  //   const isUser = role === EUserRole.USER;

  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  const filters = buildDashboardTicketsQueryFilters(role, userId);
  const {
    data: getTicketsResponse,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    error
  } = useGetTicketsQuery(filters ?? {}, { skip: !filters, refetchOnMountOrArgChange: true });

  useErrorHandler(error);

  const isLoadingQuery = isLoading || isFetching;
  const userTickets = getTicketsResponse?.data ?? [];
  const userTicketsLength = getTicketsResponse?.dataLength ?? 0;

  const filteredTickets = categoryFilter
    ? userTickets.filter(ticket => ticket.category?._id === categoryFilter._id)
    : userTickets;

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

          {isUninitialized ? (
            <Skeleton className="h-[22px] w-[40px]" />
          ) : (
            <Badge
              variant="secondary"
              className="bg-secondary text-muted-foreground hover:bg-secondary"
            >
              {t('dashboard.recentTicketsAmount', { count: filteredTickets.length ?? 0 })}
            </Badge>
          )}
        </div>

        {isUninitialized ? (
          <Skeleton className="h-[28px] w-[90px]" />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="animation-base animation-idle animation-interactive gap-1 text-xs font-bold"
          >
            <span>{t('common.viewAll')}</span>
            <ArrowRight size={12} />
          </Button>
        )}
      </div>

      {isLoadingQuery ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <div className="space-y-3">
          {userTicketsLength > 0 ? (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <TicketCategoriesFilter
                selectedCategory={categoryFilter}
                setSelectedCategory={setCategoryFilter}
                resetSelectedCategory={() => setCategoryFilter(null)}
              />
            </motion.div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            {filteredTickets.map((ticket, i) => (
              <DashboardTicketCard
                key={ticket._id}
                ticket={ticket}
                transitionDelay={0.3 + i * 0.05}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
