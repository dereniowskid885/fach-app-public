import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import { TicketDetailsSpecialistActionButtons } from './TicketDetailsSpecialistActionButtons';
import { TicketDetailsUserActionButtons } from './TicketDetailsUserActionButtons';
import { TicketDetailsAdminActionButtons } from './TicketDetailsAdminActionButtons';

export interface ITicketDetailsActionButtons {
  ticket: Ticket;
  userId?: string;
  role: EUserRole | string;
}

export default function TicketDetailsActionButtons({
  ticket,
  userId,
  role
}: ITicketDetailsActionButtons) {
  switch (role) {
    case EUserRole.SPECIALIST: {
      const currentUserEvaluation = ticket.evaluations?.find(
        evaluation => evaluation.user?._id === userId
      );

      return (
        <TicketDetailsSpecialistActionButtons
          ticket={ticket}
          currentUserEvaluation={currentUserEvaluation}
        />
      );
    }

    case EUserRole.USER:
      return <TicketDetailsUserActionButtons ticket={ticket} />;

    case EUserRole.ADMIN:
      return <TicketDetailsAdminActionButtons ticket={ticket} />;
  }
}
