'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { selectUserData } from '@/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { useGetTicketsSpecialistAvailableQuery } from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { getAvailableTicketsColumns } from '@/helpers/dataTable';
import { EFilterButton } from '@/enums/ui';
import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';

export default function AvailableTickets() {
  const { city, role, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const t = useTranslations();
  const currentLocale = useLocale();

  const [selectedCity, setSelectedCity] = useState<string | EFilterButton.ALL | undefined>(
    undefined
  );

  useEffect(() => {
    // set initial selectedCity value from user state
    if (isUserStateInitialized && selectedCity === undefined) {
      setSelectedCity(city ?? EFilterButton.ALL);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserStateInitialized]);

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    refetch
  } = useGetTicketsSpecialistAvailableQuery(
    {
      city: selectedCity === EFilterButton.ALL ? undefined : selectedCity
    },
    {
      skip: selectedCity === undefined,
      refetchOnMountOrArgChange: true
    }
  );

  useErrorHandler(getTicketsError);

  const tableColumnsData = getAvailableTicketsColumns(t, currentLocale);

  return (
    <TicketsTablePageContent
      pageName="availableTicketsPage"
      isLoadingTickets={isLoading}
      ticketsData={ticketsData?.data}
      tableColumns={tableColumnsData}
      refetchTickets={refetch}
      filterPanelComponent={
        <TicketFilterPanel
          role={role}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      }
    />
  );
}
