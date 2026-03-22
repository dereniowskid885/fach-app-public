'use client';

import { useGetTicketsCompletedQuery } from '@/api/accountApi';
import ContentCard from '@/components/common/ContentCard';
import { DataTable } from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import SearchComponent from '@/components/common/SearchComponent';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import TicketFilterPanel from '@/components/ui/TicketFilterPanel';
import UserBadge from '@/components/ui/UserBadge';
import { EFilterButton, EUserBadgeVariant } from '@/enums/ui';
import { getMyTicketsColumns } from '@/helpers/dataTableColumns';
import { getCompletedTicketsStatusFilters } from '@/helpers/ticketStatusFilter';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { ETicketStatus } from '@shared/enums/ticket';
import { isAdmin, isSpecialist, isUser } from '@shared/utils/role';
import { useLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function CompletedTickets() {
  const {
    role,
    city,
    categoryName,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const isInvalidRole = isUserStateInitialized && isAdmin(role);
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
    EFilterButton.ALL
  );

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    isFetching
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
  const isLoadingTickets = isLoading || isFetching;

  useErrorHandler(getTicketsError);

  const filteredTickets =
    ticketsData?.data?.filter(ticket => {
      const matchesSearchQuery = searchQuery
        ? ticket.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesSearchQuery;
    }) ?? [];

  const tableColumnsData = getMyTicketsColumns(t, currentLocale, role);
  const ticketStatusFilters = getCompletedTicketsStatusFilters();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          isDataLoaded={isUserStateInitialized}
          title={role ? t(`completedTicketsPage.headerTitle.${role}`) : ''}
          description={role ? t(`completedTicketsPage.headerDescription.${role}`) : ''}
        />

        {isUserStateInitialized ? (
          <div className="space-x-2">
            {isUser(role) ? <UserBadge variant={EUserBadgeVariant.CITY} text={city} /> : null}

            {isSpecialist(role) ? (
              <UserBadge variant={EUserBadgeVariant.CATEGORY} text={categoryName} />
            ) : null}
          </div>
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
          ticketStatusFilters={ticketStatusFilters}
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
