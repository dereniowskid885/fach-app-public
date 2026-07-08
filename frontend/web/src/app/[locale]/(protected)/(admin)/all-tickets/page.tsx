'use client';

import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import { EFilterButton } from '@/enums/ui';
import { getAllTicketsColumns } from '@/helpers/dataTable';
import { getAllTicketsStatusFilters } from '@/helpers/ticket';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/userSlice';
import { ETicketStatus } from 'shared-types';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';
import { paginatedAccountApi } from '@/services/api/enhanced/paginatedAccountApi';

export default function AllTickets() {
  const { role } = useSelector(selectUserData);

  const t = useTranslations();
  const currentLocale = useLocale();

  const [selectedStatus, setSelectedStatus] = useState<ETicketStatus | EFilterButton.ALL>(
    EFilterButton.ALL
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | EFilterButton.ALL>(
    EFilterButton.ALL
  );
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
  } = paginatedAccountApi.endpoints.getTicketsInfinite.useInfiniteQuery(
    {
      categoryId: selectedCategoryId === EFilterButton.ALL ? undefined : selectedCategoryId,
      status: selectedStatus === EFilterButton.ALL ? undefined : selectedStatus,
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

  const tableColumnsData = getAllTicketsColumns(t, currentLocale);
  const ticketStatusFilters = getAllTicketsStatusFilters();

  return (
    <TicketsTablePageContent
      pageName="myTicketsPage"
      isLoadingTickets={isLoading}
      ticketsData={tickets}
      tableColumns={tableColumnsData}
      refetchTickets={refetch}
      filterPanelComponent={
        <TicketFilterPanel
          role={role}
          ticketStatusFilters={ticketStatusFilters}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      }
      totalTicketsAmount={ticketsData?.pages[0].totalLength ?? 0}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
}
