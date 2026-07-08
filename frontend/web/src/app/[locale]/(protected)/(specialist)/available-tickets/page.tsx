'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { selectUserData } from '@/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { getAvailableTicketsColumns } from '@/helpers/dataTable';
import { EFilterButton } from '@/enums/ui';
import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';
import { paginatedAccountApi } from '@/services/api/enhanced/paginatedAccountApi';

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
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = paginatedAccountApi.endpoints.getTicketsSpecialistAvailableInfinite.useInfiniteQuery(
    {
      city: selectedCity === EFilterButton.ALL ? undefined : selectedCity,
      limit: 6
    },
    {
      refetchOnMountOrArgChange: true
    }
  );
  const tickets = ticketsData?.pages.flatMap(page => page.data ?? []);
  const hasNextPage = !!ticketsData?.pages[ticketsData.pages.length - 1].nextCursor;

  useErrorHandler(getTicketsError);

  const tableColumnsData = getAvailableTicketsColumns(t, currentLocale);

  return (
    <TicketsTablePageContent
      pageName="availableTicketsPage"
      isLoadingTickets={isLoading}
      ticketsData={tickets}
      tableColumns={tableColumnsData}
      refetchTickets={refetch}
      filterPanelComponent={
        <TicketFilterPanel
          role={role}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      }
      totalTicketsAmount={ticketsData?.pages[0].totalLength ?? 0}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
}
