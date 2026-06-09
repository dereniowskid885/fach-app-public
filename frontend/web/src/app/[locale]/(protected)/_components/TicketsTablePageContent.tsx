import { Badge } from '@/components/shadcn/badge';
import ContentCard from '@/components/ui/ContentCard';
import SearchComponent from '@/components/ui/SearchComponent';
import { CellContext } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';
import TicketCreateButton from '../../../../components/features/ticket/TicketCreateButton';
import { Button } from '@/components/shadcn/button';
import { RotateCcw } from 'lucide-react';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import { DataTable } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useSelector } from 'react-redux';
import { isSpecialist, isUser } from 'shared-types';
import IconBadge from '@/components/ui/IconBadge';
import { EIconBadgeVariant } from '@/enums/ui';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Ticket } from '@/services/api/generated/accountApi';

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
}

export default function TicketsTablePageContent({
  pageName,
  filterPanelComponent,
  isLoadingTickets,
  ticketsData,
  refetchTickets,
  tableColumns
}: ITicketsTablePageContent) {
  const t = useTranslations();
  const {
    role,
    isInitialized: isUserStateInitialized,
    city,
    categoryName
  } = useSelector(selectUserData);

  const [searchQuery, setSearchQuery] = useState<string>('');

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
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <SearchComponent
            inputValue={searchQuery}
            inputOnChangeHandler={setSearchQuery}
            placeholder={t('ticket.searchPlaceholder')}
          />

          <div className="flex grow flex-wrap items-center justify-end gap-4">
            <Badge variant="amount" className="mr-auto text-sm">
              {t('ticket.ticketsAmount', { count: filteredTickets.length ?? 0 })}
            </Badge>

            {isUser(role) ? <TicketCreateButton /> : null}

            <Button variant="secondary" size="lg" onClick={refetchTickets}>
              <RotateCcw size={12} />

              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {filterPanelComponent}
      </ContentCard>

      {isLoadingTickets ? (
        <LoadingSpinner className="m-auto" />
      ) : (
        <ContentCard index={1} className="py-0" contentClass="px-0">
          <DataTable data={filteredTickets} columns={tableColumns} />
        </ContentCard>
      )}
    </div>
  );
}
