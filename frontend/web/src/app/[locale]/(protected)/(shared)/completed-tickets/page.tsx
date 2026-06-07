'use client';

import { useGetTicketsCompletedQuery } from '@/services/api/generated/accountApi';
import ContentCard from '@/components/ui/ContentCard';
import { DataTable } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import SearchComponent from '@/components/ui/SearchComponent';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import TicketFilterPanel from '@/components/features/ticket/TicketFilterPanel';
import IconBadge from '@/components/ui/IconBadge';
import { EFilterButton, EIconBadgeVariant } from '@/enums/ui';
import { getMyTicketsColumns } from '@/helpers/dataTable';
import { getCompletedTicketsStatusFilters } from '@/helpers/ticket';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { isAdmin, isSpecialist, isUser, ETicketStatus } from 'shared-types';
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
            {isUser(role) ? <IconBadge variant={EIconBadgeVariant.CITY} text={city} /> : null}

            {isSpecialist(role) ? (
              <IconBadge variant={EIconBadgeVariant.CATEGORY} text={categoryName} />
            ) : null}
          </div>
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
          ticketStatusFilters={ticketStatusFilters}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
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
