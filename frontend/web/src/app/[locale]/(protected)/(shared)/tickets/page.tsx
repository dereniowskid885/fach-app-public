'use client';

import { useGetTicketsMyQuery } from '@/services/api/generated/accountApi';
import { ETicketStatus, EUserRole, isRoleAllowed } from 'shared-types';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { selectUserData } from '@/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { getMyTicketsColumns } from '@/helpers/dataTable';
import { EFilterButton } from '@/enums/ui';
import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import { getMyTicketsStatusFilters } from '@/helpers/ticket';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';
import { notFound } from 'next/navigation';

export default function MyTickets() {
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
  } = useGetTicketsMyQuery(
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
  const ticketStatusFilters = getMyTicketsStatusFilters(role);

  return (
    <TicketsTablePageContent
      pageName="myTicketsPage"
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
