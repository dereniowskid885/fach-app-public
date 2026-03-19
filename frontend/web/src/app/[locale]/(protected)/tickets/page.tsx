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
import { useState } from 'react';
import AmountBadge from '@/components/ui/AmountBadge';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import PageHeader from '@/components/common/PageHeader';
import { getMyTicketsFilters } from '@/helpers/ticketStatusFilter';
import { getMyTicketsColumns } from '@/helpers/dataTableColumns';
import { DataTable } from '@/components/common/DataTable';

export default function MyTickets() {
  const t = useTranslations();
  const { role } = useSelector(selectUserData);
  const currentLocale = useLocale();

  const ticketStatusFilterData = getMyTicketsFilters(role as EUserRole);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ETicketStatus | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const {
    data: ticketsData,
    error: getTicketsError,
    isLoading,
    isFetching
  } = useGetTicketsMyQuery(
    {
      categoryId: selectedCategoryId ?? undefined,
      status: selectedStatus ?? undefined
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

  const tableColumnsData = getMyTicketsColumns(t, currentLocale, role as EUserRole);

  return (
    <div className="space-y-6">
      <PageHeader
        isDataLoaded={Boolean(role)}
        title={role ? t(`myTicketsPage.headerTitle.${role}`) : ''}
        description={role ? t(`myTicketsPage.headerDescription.${role}`) : ''}
      />

      <ContentCard index={0} className="space-y-6 p-6 sm:p-8">
        <div className="flex justify-between gap-4">
          <div className="flex w-full items-center gap-4">
            <SearchComponent
              inputValue={searchQuery}
              inputOnChangeHandler={setSearchQuery}
              placeholder={t('ticket.searchPlaceholder')}
            />

            <AmountBadge className="text-nowrap text-sm">
              {t('ticket.ticketsAmount', { count: filteredTickets.length ?? 0 })}
            </AmountBadge>
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
