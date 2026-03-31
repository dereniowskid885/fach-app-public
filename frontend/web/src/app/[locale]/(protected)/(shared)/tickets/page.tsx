'use client';

import { useGetTicketsMyQuery } from '@/services/api/generated/accountApi';
import ContentCard from '@/components/common/ContentCard';
import SearchComponent from '@/components/common/SearchComponent';
import TicketCreateButton from '@/components/ui/TicketCreateButton';
import { ETicketStatus, EUserRole, isRoleAllowed, isSpecialist, isUser } from 'shared-types';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/common/PageHeader';
import { getMyTicketsColumns } from '@/helpers/dataTableColumns';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import UserBadge from '@/components/ui/UserBadge';
import { EFilterButton, EUserBadgeVariant } from '@/enums/ui';
import TicketFilterPanel from '@/components/ui/TicketFilterPanel';
import { notFound } from 'next/navigation';
import { getMyTicketsStatusFilters } from '@/helpers/ticketStatusFilter';

export default function MyTickets() {
  const {
    role,
    city,
    categoryName,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const isInvalidRole =
    isUserStateInitialized && !isRoleAllowed(role, [EUserRole.SPECIALIST, EUserRole.USER]);
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
  const ticketStatusFilters = getMyTicketsStatusFilters(role);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          isDataLoaded={isUserStateInitialized}
          title={role ? t(`myTicketsPage.headerTitle.${role}`) : ''}
          description={role ? t(`myTicketsPage.headerDescription.${role}`) : ''}
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

          {isUser(role) ? <TicketCreateButton /> : null}
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
