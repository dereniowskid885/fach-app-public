'use client';

import { useGetTicketsCompletedQuery } from '@/services/api/generated/accountApi';
import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import { EFilterButton } from '@/enums/ui';
import { getMyTicketsColumns } from '@/helpers/dataTable';
import { getCompletedTicketsStatusFilters } from '@/helpers/ticket';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/userSlice';
import { ETicketStatus, EUserRole, isRoleAllowed } from 'shared-types';
import { useLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';

export default function CompletedTickets() {
  const { role, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const isInvalidRole =
    isUserStateInitialized && !isRoleAllowed([EUserRole.SPECIALIST, EUserRole.USER], role);
  if (isInvalidRole) {
    notFound();
  }

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
    refetch
  } = useGetTicketsCompletedQuery(
    {
      categoryId: selectedCategoryId === EFilterButton.ALL ? undefined : selectedCategoryId,
      status: selectedStatus === EFilterButton.ALL ? undefined : selectedStatus,
      city: selectedCity === EFilterButton.ALL ? undefined : selectedCity
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  useErrorHandler(getTicketsError);

  const tableColumnsData = getMyTicketsColumns(t, currentLocale, role);
  const ticketStatusFilters = getCompletedTicketsStatusFilters();

  return (
    <TicketsTablePageContent
      pageName="completedTicketsPage"
      isLoadingTickets={isLoading}
      ticketsData={ticketsData?.data}
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
    />
  );
}
