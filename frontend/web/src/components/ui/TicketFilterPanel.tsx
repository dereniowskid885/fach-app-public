import { EUserRole } from '@shared/enums/role';
import { ETicketStatus } from '@shared/enums/ticket';
import { Dispatch, SetStateAction } from 'react';
import { Separator } from '../shadcn/separator';
import TicketCategoryFilter from './TicketCategoryFilter';
import TicketCityFilter from './TicketCityFilter';
import TicketStatusFilter from './TicketStatusFilter';
import { isAdmin, isSpecialist, isUser } from '@shared/utils/role';
import { EFilterButton } from '@/enums/ui';

export interface ITicketFilterPanel {
  role: EUserRole | string;
  selectedCity?: string | EFilterButton.ALL;
  setSelectedCity?: Dispatch<SetStateAction<string | EFilterButton.ALL | undefined>>;
  selectedCategoryId?: string | EFilterButton.ALL;
  setSelectedCategoryId?: Dispatch<SetStateAction<string | EFilterButton.ALL>>;
  ticketStatusFilters?: ETicketStatus[];
  selectedStatus?: ETicketStatus | EFilterButton.ALL;
  setSelectedStatus?: (status: ETicketStatus | EFilterButton.ALL) => void;
}

export default function TicketFilterPanel({
  role,
  selectedCity,
  setSelectedCity,
  selectedCategoryId,
  setSelectedCategoryId,
  ticketStatusFilters = [],
  selectedStatus,
  setSelectedStatus
}: ITicketFilterPanel) {
  const isCityFilters = selectedCity !== undefined && setSelectedCity;
  const isCategoryFilters = selectedCategoryId !== undefined && setSelectedCategoryId;
  const isStatusFilters = selectedStatus !== undefined && setSelectedStatus;

  return (
    <>
      {isCategoryFilters && (isUser(role) || isAdmin(role)) ? (
        <>
          <Separator className="bg-border" />

          <TicketCategoryFilter
            showHeader={true}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        </>
      ) : null}

      {isCityFilters && (isSpecialist(role) || isAdmin(role)) ? (
        <>
          <Separator className="bg-border" />

          <TicketCityFilter
            showHeader={true}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        </>
      ) : null}

      {isStatusFilters ? (
        <>
          <Separator className="bg-border" />

          <TicketStatusFilter
            statuses={ticketStatusFilters}
            showHeader={true}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </>
      ) : null}
    </>
  );
}
