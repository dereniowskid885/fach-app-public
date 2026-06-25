'use client';

import TicketFilterPanel from '@/app/[locale]/(protected)/_components/TicketFilterPanel';
import { EFilterButton } from '@/enums/ui';
import { getAvailableTicketsColumns } from '@/helpers/dataTable';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/userSlice';
import { useGetTicketsSpecialistEvaluationsQuery } from '@/services/api/generated/accountApi';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import TicketsTablePageContent from '@/app/[locale]/(protected)/_components/TicketsTablePageContent';
import { useState } from 'react';

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
    refetch
  } = useGetTicketsSpecialistEvaluationsQuery(
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
      pageName="myEvaluationsPage"
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
