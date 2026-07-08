'use client';

import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import { EFilterButton } from '@/enums/ui';
import { getAvailableTicketsColumns } from '@/helpers/dataTable';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/userSlice';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';
import { useState } from 'react';
import { paginatedAccountApi } from '@/services/api/enhanced/paginatedAccountApi';

export default function MyEvaluations() {
  const { role } = useSelector(selectUserData);

  const t = useTranslations();
  const currentLocale = useLocale();

  const [selectedCity, setSelectedCity] = useState<string | EFilterButton.ALL | undefined>(
    EFilterButton.ALL
  );

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = paginatedAccountApi.endpoints.getTicketsSpecialistEvaluationsInfinite.useInfiniteQuery(
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
      pageName="myEvaluationsPage"
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
