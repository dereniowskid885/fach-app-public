'use client';

import { useGetTicketsQuery } from '@/api/accountApi';
import ContentCard from '@/components/common/ContentCard';
import { DataTable } from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import SearchComponent from '@/components/common/SearchComponent';
import { Badge } from '@/components/shadcn/badge';
import TicketFilterPanel from '@/components/ui/TicketFilterPanel';
import { EFilterButton } from '@/enums/ui';
import { getAllTicketsColumns } from '@/helpers/dataTableColumns';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { ETicketStatus } from '@shared/enums/ticket';
import { isAdmin } from '@shared/utils/role';
import { useLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AllTickets() {
  const { role, city, isInitialized: isUserStateInitialized } = useSelector(selectUserData);

  const isInvalidRole = isUserStateInitialized && !isAdmin(role);
  if (isInvalidRole) {
    notFound();
  }

  const t = useTranslations();
  const currentLocale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ETicketStatus | EFilterButton.ALL>(
    EFilterButton.ALL
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | EFilterButton.ALL>(
    EFilterButton.ALL
  );
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
  } = useGetTicketsQuery(
    {
      categoryId: selectedCategoryId === EFilterButton.ALL ? undefined : selectedCategoryId,
      status: selectedStatus === EFilterButton.ALL ? undefined : selectedStatus,
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

  const tableColumnsData = getAllTicketsColumns(t, currentLocale);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          isDataLoaded={isUserStateInitialized}
          title={role ? t(`myTicketsPage.headerTitle.${role}`) : ''}
          description={role ? t(`myTicketsPage.headerDescription.${role}`) : ''}
        />
      </div>

      <ContentCard index={0} className="space-y-6 p-6 sm:p-8">
        <div className="flex justify-between gap-4">
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
        </div>

        <TicketFilterPanel
          role={role}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
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
