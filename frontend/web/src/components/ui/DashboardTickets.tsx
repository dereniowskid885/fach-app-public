'use client';

import { Button } from '@/components/shadcn/button';
import { Typography } from '../common/Typography';
import { useState } from 'react';
import TicketCreateDialog from './TicketCreateDialog';
import CategorySelect from './CategorySelect';
import { Category, useGetTicketsQuery } from '@/api/accountApi';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { EUserRole } from '@/constants/userRole';
import { notFound } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketCarousel from './TicketCarousel';
import { buildDashboardTicketsQueryFilters } from '@/helpers/buildDashboardTicketsQueryFilters';

export default function DashboardTickets() {
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  const { role, userId } = useAppSelector(selectUserData);
  const isUser = role === EUserRole.USER;

  const filters = buildDashboardTicketsQueryFilters(role, userId);
  const {
    data: getTicketsResponse,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetTicketsQuery(filters ?? {}, { skip: !filters, refetchOnMountOrArgChange: true });
  const userTickets = getTicketsResponse?.data ?? [];
  const userTicketsLength = getTicketsResponse?.dataLength ?? 0;

  const filteredTickets = categoryFilter
    ? userTickets.filter(ticket => ticket.category === categoryFilter)
    : userTickets;

  // TODO: error page component to be created
  if (isError) {
    notFound();
  }

  return isLoading || isFetching ? (
    // TODO: skeleton loader to be added
    <div className="flex h-[420px] items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">Twoje sprawy: {getTicketsResponse?.dataLength}</Typography>

      <div className="flex justify-between">
        {userTicketsLength > 0 && isUser ? (
          <CategorySelect
            selectedCategory={categoryFilter}
            setSelectedCategory={setCategoryFilter}
            resetSelectedCategory={() => setCategoryFilter(null)}
          />
        ) : null}

        {categoryFilter ? (
          <Typography variant="small" className="self-end text-neutral-50">
            Ilość: {filteredTickets.length}
          </Typography>
        ) : null}
      </div>

      <TicketCarousel tickets={filteredTickets} />

      {isUser ? (
        <>
          <Button
            variant="secondary"
            className="bg-info-50"
            onClick={() => setTicketCreateDialog(true)}
          >
            Utwórz sprawę
          </Button>

          <TicketCreateDialog
            open={ticketCreateDialog}
            refetchTickets={refetch}
            closeDialog={() => setTicketCreateDialog(false)}
          />
        </>
      ) : null}
    </div>
  );
}
