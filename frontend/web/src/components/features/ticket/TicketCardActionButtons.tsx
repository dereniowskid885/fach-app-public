import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import TicketCardSpecialistActionButtons from './TicketCardSpecialistActionButtons';
import TicketCardUserActionButtons from './TicketCardUserActionButtons';
import TicketCardAdminActionButtons from './TicketCardAdminActionButtons';

export interface ITicketCardActionButtons {
  ticket: Ticket;
  role: EUserRole | string;
  isTableView?: boolean;
}

export default function TicketCardActionButtons({
  ticket,
  role,
  isTableView = false
}: ITicketCardActionButtons) {
  switch (role) {
    case EUserRole.SPECIALIST:
      return <TicketCardSpecialistActionButtons ticket={ticket} hideDetailsButton={isTableView} />;

    case EUserRole.USER:
      return <TicketCardUserActionButtons ticket={ticket} hideDetailsButton={isTableView} />;

    case EUserRole.ADMIN:
      return <TicketCardAdminActionButtons ticket={ticket} hideDetailsButton={isTableView} />;
  }
}
