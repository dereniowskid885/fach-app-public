'use client';

import ContentCard from '@/components/common/ContentCard';
import SearchComponent from '@/components/common/SearchComponent';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import AmountBadge from '@/components/ui/AmountBadge';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useGetTicketsSpecialistAvailableQuery } from '@/api/accountApi';
import { Separator } from '@/components/shadcn/separator';
import TicketCityFilter from '@/components/ui/TicketCityFilter';
import DataTableSpecialistAvailableTicketsPage from '@/components/ui/DataTableSpecialistAvailableTicketsPage';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import PageHeader from '@/components/common/PageHeader';

export default function AvailableTickets() {
  const t = useTranslations();
  const { city } = useSelector(selectUserData);

  // TODO: fix redundant query triggering
  // probably usage of api will fix the issue

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(city);

  useEffect(() => {
    setSelectedCity(city);
  }, [city]);

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    isFetching
  } = useGetTicketsSpecialistAvailableQuery(
    {
      city: selectedCity ?? undefined
    },
    {
      skip: !city
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('availableTicketsPage.headerTitle')}
        description={t('availableTicketsPage.headerDescription')}
      />

      <ContentCard index={0} className="space-y-6 p-6 sm:p-8">
        <div className="flex w-full items-center gap-4">
          <SearchComponent
            inputValue={searchQuery}
            inputOnChangeHandler={setSearchQuery}
            placeholder={t('ticket.searchPlaceholder')}
          />

          <AmountBadge className="text-sm">
            {t('ticket.ticketsAmount', { count: filteredTickets.length ?? 0 })}
          </AmountBadge>
        </div>

        <Separator className="bg-border" />

        <TicketCityFilter
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          showHeader={true}
        />
      </ContentCard>

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <ContentCard index={1} className="p-0 sm:p-0">
          <DataTableSpecialistAvailableTicketsPage tableData={filteredTickets} />
        </ContentCard>
      )}
    </div>
  );
}
