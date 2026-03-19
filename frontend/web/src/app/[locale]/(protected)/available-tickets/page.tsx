'use client';

import ContentCard from '@/components/common/ContentCard';
import SearchComponent from '@/components/common/SearchComponent';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useGetTicketsSpecialistAvailableQuery } from '@/api/accountApi';
import { Separator } from '@/components/shadcn/separator';
import TicketCityFilter from '@/components/ui/TicketCityFilter';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/common/PageHeader';
import { getAvailableTicketsColumns } from '@/helpers/dataTableColumns';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/shadcn/badge';
import { TTicketCityFilter } from '@/types/ticket';
import { Skeleton } from '@/components/shadcn/skeleton';
import UserBadge from '@/components/ui/UserBadge';
import { EUserBadgeVariant } from '@/enums/ui';

export default function AvailableTickets() {
  const t = useTranslations();
  const currentLocale = useLocale();
  const {
    userId,
    city,
    categoryName,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<TTicketCityFilter>(undefined);

  useEffect(() => {
    // set initial selectedCity value from user state
    if (isUserStateInitialized && selectedCity === undefined) {
      setSelectedCity(city ?? null);
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
      city: selectedCity || undefined
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
          title={t('availableTicketsPage.headerTitle')}
          description={t('availableTicketsPage.headerDescription')}
        />

        {isUserStateInitialized ? (
          <UserBadge variant={EUserBadgeVariant.CATEGORY} text={categoryName} />
        ) : (
          <Skeleton className="h-[22px] w-[80px]" />
        )}
      </div>

      <ContentCard index={0} className="space-y-6 p-6 sm:p-8">
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

        <Separator className="bg-border" />

        <TicketCityFilter
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          showHeader={true}
        />
      </ContentCard>

      <ContentCard index={1} className="p-0 sm:p-0">
        <DataTable
          isLoadingData={isLoadingTickets}
          data={filteredTickets}
          columns={tableColumnsData}
        />
      </ContentCard>
    </div>
  );
}
