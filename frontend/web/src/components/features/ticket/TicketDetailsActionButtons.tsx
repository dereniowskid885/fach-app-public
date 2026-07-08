import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import { TicketDetailsSpecialistActionButtons } from './TicketDetailsSpecialistActionButtons';
import { TicketDetailsUserActionButtons } from './TicketDetailsUserActionButtons';
import { TicketDetailsAdminActionButtons } from './TicketDetailsAdminActionButtons';

export interface ITicketDetailsActionButtons {
  ticket: Ticket;
  role: EUserRole | string;
}

export default function TicketDetailsActionButtons({ ticket, role }: ITicketDetailsActionButtons) {
  switch (role) {
    case EUserRole.SPECIALIST: {
      return <TicketDetailsSpecialistActionButtons ticket={ticket} />;
    }

    case EUserRole.USER:
      return <TicketDetailsUserActionButtons ticket={ticket} />;

    case EUserRole.ADMIN:
      return <TicketDetailsAdminActionButtons ticket={ticket} />;
  }
}
