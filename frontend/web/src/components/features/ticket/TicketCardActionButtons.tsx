import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import TicketCardSpecialistActionButtons from './TicketCardSpecialistActionButtons';
import TicketCardUserActionButtons from './TicketCardUserActionButtons';
import TicketCardAdminActionButtons from './TicketCardAdminActionButtons';

export interface ITicketCardActionButtons {
  ticket: Ticket;
  userId?: string;
  role: EUserRole | string;
}

export default function TicketCardActionButtons({
  ticket,
  userId,
  role
}: ITicketCardActionButtons) {
  switch (role) {
    case EUserRole.SPECIALIST: {
      const currentUserEvaluation = ticket.evaluations?.find(
        evaluation => evaluation.user?._id === userId
      );

      return (
        <TicketCardSpecialistActionButtons
          ticket={ticket}
          currentUserEvaluation={currentUserEvaluation}
        />
      );
    }

    case EUserRole.USER:
      return <TicketCardUserActionButtons ticket={ticket} />;

    case EUserRole.ADMIN:
      return <TicketCardAdminActionButtons ticket={ticket} />;
  }
}
