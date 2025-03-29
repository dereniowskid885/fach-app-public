'use client';

import React, { useEffect } from 'react';
import TicketCarousel from './TicketCarousel';
import { useGetTicketsSpecialistByCityQuery } from '@/api/ticketingApi';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { Typography } from '../common/Typography';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useForm } from 'react-hook-form';
import CitySelect from './CitySelect';

export default function SpecialistPendingTickets() {
  const { city } = useAppSelector(selectUserData);
  const { register, watch } = useForm();
  const selectedCity = watch('city') ?? city;

  const {
    data: tickets = [],
    isLoading,
    isFetching
  } = useGetTicketsSpecialistByCityQuery(
    { city: selectedCity },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">
        Sprawy z miasta {selectedCity}: {tickets.length}
      </Typography>
      <CitySelect register={register('city')} defaultValue={selectedCity} id="city" />
      {isLoading || isFetching ? (
        // TODO: skeleton loader to be added
        <div className="flex h-[420px] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <TicketCarousel tickets={tickets} />
      )}
    </div>
  );
}
