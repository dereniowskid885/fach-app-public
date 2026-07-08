import { Badge } from '@/components/shadcn/badge';
import ContentCard from '@/components/ui/ContentCard';
import SearchComponent from '@/components/ui/SearchComponent';
import { CellContext } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import TicketCreateButton from '../../../../components/features/ticket/TicketCreateButton';
import { Button } from '@/components/shadcn/button';
import { ChevronDownIcon, ChevronUpIcon, RotateCcw } from 'lucide-react';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import { DataTable } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import { selectUserData } from '@/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import { isSpecialist, isUser } from 'shared-types';
import IconBadge from '@/components/ui/IconBadge';
import { EIconBadgeVariant } from '@/enums/ui';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Ticket } from '@/services/api/generated/accountApi';
import { motion } from 'framer-motion';

export interface ITicketsTablePageContent {
  pageName: string;
  filterPanelComponent: ReactNode;
  isLoadingTickets?: boolean;
  ticketsData?: Ticket[];
  refetchTickets?: () => void;
  tableColumns: {
    id: string;
    cell: (item: CellContext<Ticket, unknown>) => JSX.Element;
  }[];
  totalTicketsAmount: number;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  hasNextPage?: boolean;
}

export default function TicketsTablePageContent({
  pageName,
  filterPanelComponent,
  isLoadingTickets,
  ticketsData,
  refetchTickets,
  tableColumns,
  totalTicketsAmount,
  isLoadingMore,
  onLoadMore,
  hasNextPage
}: ITicketsTablePageContent) {
  const t = useTranslations();
  const {
    role,
    isInitialized: isUserStateInitialized,
    city,
    categoryName
  } = useSelector(selectUserData);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filteredTickets =
    ticketsData?.filter(ticket => {
      const matchesSearchQuery = searchQuery
        ? ticket.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesSearchQuery;
    }) ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PageHeader
          isDataLoaded={isUserStateInitialized}
          title={role ? t(`${pageName}.headerTitle.${role}`) : ''}
          description={role ? t(`${pageName}.headerDescription.${role}`) : ''}
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
        <motion.div
          animate={showFilters ? {} : { margin: 0 }}
          transition={{ duration: 0.3 }}
          className={'flex flex-col justify-between gap-4 xl:flex-row xl:items-center'}
        >
          <SearchComponent
            inputValue={searchQuery}
            inputOnChangeHandler={setSearchQuery}
            placeholder={t('ticket.searchPlaceholder')}
          />

          <div className="flex grow flex-wrap items-center justify-end gap-4">
            <Badge variant="amount" className="mr-auto text-sm">
              {t('ticket.ticketsAmount', {
                count: searchQuery.length > 0 ? (filteredTickets.length ?? 0) : totalTicketsAmount
              })}
            </Badge>

            {isUser(role) ? <TicketCreateButton /> : null}

            <Button variant="secondary" size="lg" onClick={refetchTickets}>
              <RotateCcw size={12} />

              {t('common.refresh')}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: showFilters ? 1 : 0, height: showFilters ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {filterPanelComponent}
        </motion.div>
      </ContentCard>

      <ContentCard
        index={1}
        className="py-0"
        contentClass="px-0 flex items-center justify-center"
        noBackground={true}
      >
        <Button variant="ghost" size="lg" onClick={() => setShowFilters(!showFilters)}>
          {showFilters
            ? t('ticketTablePageContent.hideFiltersButton')
            : t('ticketTablePageContent.showFiltersButton')}
          {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </ContentCard>

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <ContentCard index={2} className="py-0" contentClass="px-0">
          <DataTable
            data={filteredTickets}
            columns={tableColumns}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            hasNextPage={hasNextPage}
          />
        </ContentCard>
      )}
    </div>
  );
}
