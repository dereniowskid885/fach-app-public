'use client';

import { Button } from '@/components/shadcn/button';
import { Typography } from '../common/Typography';
import { useState } from 'react';
import TicketCreateDialog from './TicketCreateDialog';
import CategorySelect from './CategorySelect';
import { GetTicketsByIdApiResponse, useGetTicketsQuery } from '@/api/ticketingApi';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { EUserRole } from '@/constants/enums';
import { notFound } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import TicketCarousel from './TicketCarousel';

export default function DashboardTickets() {
  const [categoryFilter, setCategoryFilter] = useState<
    GetTicketsByIdApiResponse['category'] | null
  >(null);
  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  const { role } = useAppSelector(selectUserData);

  const {
    data: userTickets = [],
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetTicketsQuery(undefined, { refetchOnMountOrArgChange: true });
  const filteredTickets = categoryFilter
    ? userTickets.filter(ticket => ticket.category?._id === categoryFilter._id)
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
      <Typography variant="h3">Twoje sprawy: {userTickets.length}</Typography>
      <div className="flex justify-between">
        {userTickets.length > 0 ? (
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
      {role === EUserRole.USER ? (
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
