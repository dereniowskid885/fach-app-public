'use client';

import ContentCard from '@/components/common/ContentCard';
import { DataTable } from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import SearchComponent from '@/components/common/SearchComponent';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import TicketFilterPanel from '@/components/ui/TicketFilterPanel';
import UserBadge from '@/components/ui/UserBadge';
import { EFilterButton, EUserBadgeVariant } from '@/enums/ui';
import { getAvailableTicketsColumns } from '@/helpers/dataTableColumns';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useGetTicketsSpecialistEvaluationsQuery } from '@/services/api/generated/accountApi';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyEvaluations() {
  const {
    userId,
    categoryName,
    role,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const t = useTranslations();
  const currentLocale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | EFilterButton.ALL | undefined>(
    EFilterButton.ALL
  );

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    isFetching
  } = useGetTicketsSpecialistEvaluationsQuery(
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
          title={t('myEvaluationsPage.headerTitle')}
          description={t('myEvaluationsPage.headerDescription')}
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

        <TicketFilterPanel
          role={role}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
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
