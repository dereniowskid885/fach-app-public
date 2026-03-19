'use client';

import { useGetTicketsMyQuery } from '@/api/accountApi';
import ContentCard from '@/components/common/ContentCard';
import SearchComponent from '@/components/common/SearchComponent';
import { Separator } from '@/components/shadcn/separator';
import TicketCategoriesFilter from '@/components/ui/TicketCategoriesFilter';
import TicketCreateButton from '@/components/ui/TicketCreateButton';
import TicketStatusFilter from '@/components/ui/TicketStatusFilter';
import { ETicketStatus } from '@shared/enums/ticket';
import { EUserRole } from '@shared/enums/role';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/common/PageHeader';
import { getMyTicketsFilters } from '@/helpers/ticketStatusFilter';
import { getMyTicketsColumns } from '@/helpers/dataTableColumns';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/shadcn/badge';
import TicketCityFilter from '@/components/ui/TicketCityFilter';
import { TTicketCityFilter } from '@/types/ticket';
import { Skeleton } from '@/components/shadcn/skeleton';
import UserBadge from '@/components/ui/UserBadge';
import { EUserBadgeVariant } from '@/enums/ui';

export default function MyTickets() {
  const t = useTranslations();
  const {
    role,
    city,
    categoryName,
    isLoading: isLoadingUserState,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);
  const currentLocale = useLocale();

  const ticketStatusFilterData = getMyTicketsFilters(role as EUserRole);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ETicketStatus | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<TTicketCityFilter>(undefined);

  useEffect(() => {
    if (role !== EUserRole.SPECIALIST) return;

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
  } = useGetTicketsMyQuery(
    {
      categoryId: selectedCategoryId || undefined,
      status: selectedStatus || undefined,
      city: selectedCity || undefined
    },
    {
      skip: isLoadingUserState || (role === EUserRole.SPECIALIST && selectedCity === undefined),
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

  const tableColumnsData = getMyTicketsColumns(t, currentLocale, role as EUserRole);

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
            {role === EUserRole.USER ? (
              <UserBadge variant={EUserBadgeVariant.CITY} text={city} />
            ) : null}

            {role === EUserRole.SPECIALIST ? (
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

          <TicketCreateButton />
        </div>

        {role === EUserRole.USER ? (
          <>
            <Separator className="bg-border" />

            <TicketCategoriesFilter
              showHeader={true}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
            />
          </>
        ) : null}

        {role === EUserRole.SPECIALIST ? (
          <>
            <Separator className="bg-border" />

            <TicketCityFilter
              showHeader={true}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </>
        ) : null}

        <Separator className="bg-border" />

        <TicketStatusFilter
          statuses={ticketStatusFilterData}
          showHeader={true}
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
