'use client';

import React from 'react';
import TicketCarousel from './TicketCarousel';
import { useGetTicketsSpecialistQuery } from '@/api/ticketingApi';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { Typography } from '../common/Typography';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export default function SpecialistPendingTickets() {
  const { city } = useAppSelector(selectUserData);

  const {
    data: tickets = [],
    isLoading,
    isFetching
  } = useGetTicketsSpecialistQuery(undefined, { refetchOnMountOrArgChange: true });

  return isLoading || isFetching ? (
    // TODO: skeleton loader to be added
    <div className="flex h-[420px] items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">
        Sprawy z miasta {city}: {tickets.length}
      </Typography>
      <TicketCarousel tickets={tickets} />
    </div>
  );
}
