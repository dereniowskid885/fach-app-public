'use client';

import { useGetTicketsMyQuery } from '@/services/api/generated/accountApi';
import ContentCard from '@/components/ui/ContentCard';
import SearchComponent from '@/components/ui/SearchComponent';
import TicketCreateButton from '@/components/features/ticket/TicketCreateButton';
import { ETicketStatus, EUserRole, isRoleAllowed, isSpecialist, isUser } from 'shared-types';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/ui/PageHeader';
import { getMyTicketsColumns } from '@/helpers/dataTable';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/shadcn/badge';
import { Skeleton } from '@/components/shadcn/skeleton';
import IconBadge from '@/components/ui/IconBadge';
import { EFilterButton, EIconBadgeVariant } from '@/enums/ui';
import TicketFilterPanel from '@/components/features/ticket/TicketFilterPanel';
import { notFound } from 'next/navigation';
import { getMyTicketsStatusFilters } from '@/helpers/ticket';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/shadcn/button';

export default function MyTickets() {
  const {
    role,
    city,
    categoryName,
    isInitialized: isUserStateInitialized
  } = useSelector(selectUserData);

  const isInvalidRole =
    isUserStateInitialized && !isRoleAllowed([EUserRole.SPECIALIST, EUserRole.USER], role);
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
    isFetching,
    refetch
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
            {isUser(role) ? <IconBadge variant={EIconBadgeVariant.CITY} text={city} /> : null}

            {isSpecialist(role) ? (
              <IconBadge variant={EIconBadgeVariant.CATEGORY} text={categoryName} />
            ) : null}
          </div>
        ) : (
          <Skeleton className="h-5.5 w-20" />
        )}
      </div>

      <ContentCard index={0} contentClass="space-y-6">
        <div className="flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-4">
            {isUser(role) ? <TicketCreateButton /> : null}

            <Button variant="secondary" size="lg" onClick={refetch}>
              <RotateCcw size={12} />

              {t('common.refresh')}
            </Button>
          </div>
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

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <ContentCard index={1} className="py-0" contentClass="px-0">
          <DataTable data={filteredTickets} columns={tableColumnsData} />
        </ContentCard>
      )}
    </div>
  );
}
