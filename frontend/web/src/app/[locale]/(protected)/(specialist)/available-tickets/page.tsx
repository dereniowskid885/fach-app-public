'use client';

import ContentCard from '@/components/ui/ContentCard';
import SearchComponent from '@/components/ui/SearchComponent';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useGetTicketsSpecialistAvailableQuery } from '@/services/api/generated/accountApi';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/ui/PageHeader';
import { getAvailableTicketsColumns } from '@/helpers/dataTable';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import IconBadge from '@/components/ui/IconBadge';
import { EFilterButton, EIconBadgeVariant } from '@/enums/ui';
import { notFound } from 'next/navigation';
import { isSpecialist } from 'shared-types';
import TicketFilterPanel from '@/components/features/ticket/TicketFilterPanel';

export default function AvailableTickets() {
  const {
    userId,
    city,
    categoryName,
    role,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const isInvalidRole = isUserStateInitialized && !isSpecialist(role);
  if (isInvalidRole) {
    notFound();
  }

  const t = useTranslations();
  const currentLocale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
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
    isFetching
  } = useGetTicketsSpecialistAvailableQuery(
    {
      city: selectedCity === EFilterButton.ALL ? undefined : selectedCity
    },
    {
      skip: selectedCity === undefined,
      refetchOnMountOrArgChange: true
    }
  );
  const isLoadingTickets = isLoading || isFetching;

  useErrorHandler(getTicketsError);

  const filteredTickets =
    ticketsData?.data?.filter(ticket => {
      const matchesSearchQuery = searchQuery
        ? ticket.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesSearchQuery;
    }) ?? [];

  const tableColumnsData = getAvailableTicketsColumns(t, currentLocale, userId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          isDataLoaded={isUserStateInitialized}
          title={t('availableTicketsPage.headerTitle')}
          description={t('availableTicketsPage.headerDescription')}
        />

        {isUserStateInitialized ? (
          <IconBadge variant={EIconBadgeVariant.CATEGORY} text={categoryName} />
        ) : (
          <Skeleton className="h-6 w-20" />
        )}
      </div>

      <ContentCard index={0} contentClass="space-y-6">
        <div className="flex w-full items-center gap-4">
          <SearchComponent
            inputValue={searchQuery}
            inputOnChangeHandler={setSearchQuery}
            placeholder={t('ticket.searchPlaceholder')}
          />

          <Badge variant="amount" className="text-sm">
            {t('ticket.ticketsAmount', { count: filteredTickets.length ?? 0 })}
          </Badge>
        </div>

        <TicketFilterPanel
          role={role}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </ContentCard>

      <ContentCard index={1} className="py-0" contentClass="px-0">
        <DataTable
          isLoadingData={isLoadingTickets}
          data={filteredTickets}
          columns={tableColumnsData}
        />
      </ContentCard>
    </div>
  );
}
