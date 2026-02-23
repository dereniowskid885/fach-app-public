import { ArrowRight, Clock, MoreVertical } from 'lucide-react';
import { Button } from '../shadcn/button';
import { motion } from 'framer-motion';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { Category, useGetTicketsQuery } from '@/api/accountApi';
import { Typography } from '../common/Typography';
import TicketStatusIcon from './TicketStatusIcon';
import TicketStatusBadge from './TicketStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { Separator } from '../shadcn/separator';
import { getLocaleDateString } from '@/lib/dateUtils';
import { TbCategory } from 'react-icons/tb';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { Skeleton } from '../shadcn/skeleton';
import { Badge } from '../shadcn/badge';
import TicketCategoriesFilter from './TicketCategoriesFilter';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getUserFullName } from '@/lib/utils';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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

          <div className="space-y-3">
            {filteredTickets.map((ticket, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                key={ticket._id}
                className="group relative flex cursor-pointer gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <TicketStatusIcon status={ticket.status} className="self-start" />

                <div className="flex max-w-[800px] flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <TbCategory size={12} className="text-tertiary" />

                      <Typography
                        variant="note"
                        className="font-mono font-bold uppercase tracking-widest text-tertiary"
                      >
                        {ticket.category?.name}
                      </Typography>
                    </div>

                    {ticket.updatedAt ? (
                      <>
                        <Separator orientation="vertical" className="h-4 bg-tertiary" />

                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-tertiary" />

                          <Typography
                            variant="note"
                            className="font-bold uppercase tracking-tighter text-tertiary"
                          >
                            {getLocaleDateString(ticket.updatedAt)}
                          </Typography>
                        </div>
                      </>
                    ) : null}

                    <Separator orientation="vertical" className="h-4 bg-tertiary" />

                    <TicketStatusBadge status={ticket.status} />
                  </div>

                  <div className="space-y-0.5">
                    <Typography variant="muted" className="line-clamp-1 font-semibold text-primary">
                      {ticket.title}
                    </Typography>

                    <Typography variant="small" className="line-clamp-2 text-muted-foreground">
                      {ticket.description}
                    </Typography>
                  </div>

                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="h-8 w-8 overflow-hidden rounded-full border">
                        <Avatar className="h-full w-full">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            className="object-cover"
                          />
                          <AvatarFallback>{t('common.avatar')}</AvatarFallback>
                        </Avatar>
                      </div>

                      <Typography variant="note" className="text-primary">
                        {getUserFullName(ticket.assignee, t('common.unassigned'))}
                      </Typography>

                      <Typography
                        variant="note"
                        className="font-semibold text-primary"
                      >{`(${ticket.assignee?.email})`}</Typography>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex flex-col items-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="animation-base animation-idle animation-interactive h-8 w-8 rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
