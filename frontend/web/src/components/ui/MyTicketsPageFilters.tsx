import { getMyTicketsFilters } from '@/helpers/ticketStatusFilter';
import { TTicketCityFilter } from '@/types/ticket';
import { EUserRole } from '@shared/enums/role';
import { ETicketStatus } from '@shared/enums/ticket';
import { Dispatch, SetStateAction } from 'react';
import { Separator } from '../shadcn/separator';
import TicketCategoriesFilter from './TicketCategoriesFilter';
import TicketCityFilter from './TicketCityFilter';
import TicketStatusFilter from './TicketStatusFilter';

export interface IMyTicketsPageFilters {
  role: EUserRole;
  selectedCity: TTicketCityFilter;
  setSelectedCity: Dispatch<SetStateAction<TTicketCityFilter>>;
  selectedCategoryId: string | null;
  setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
  selectedStatus: ETicketStatus | null;
  setSelectedStatus: (status: ETicketStatus | null) => void;
}

export default function MyTicketsPageFilters({
  role,
  selectedCity,
  setSelectedCity,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedStatus,
  setSelectedStatus
}: IMyTicketsPageFilters) {
  const ticketStatusFilterData = getMyTicketsFilters(role);

  const isUser = role === EUserRole.USER;
  const isSpecialist = role === EUserRole.SPECIALIST;
  const isAdmin = role === EUserRole.ADMIN;

  return (
    <>
      {isUser || isAdmin ? (
        <>
          <Separator className="bg-border" />

          <TicketCategoriesFilter
            showHeader={true}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />
        </>
      ) : null}

      {isSpecialist || isAdmin ? (
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
    </>
  );
}
