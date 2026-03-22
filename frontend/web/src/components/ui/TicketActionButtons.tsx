import { Ticket } from '@/api/accountApi';
import { EUserRole } from '@shared/enums/role';
import { TicketSpecialistActionButtons } from './TicketSpecialistActionButtons';
import TicketUserActionButtons from './TicketUserActionButtons';

export interface ITicketActionButtons {
  ticket: Ticket;
  userId?: string;
  role: EUserRole | string;
}

export default function TicketActionButtons({ ticket, userId, role }: ITicketActionButtons) {
  switch (role) {
    case EUserRole.SPECIALIST: {
      const currentUserEvaluation = ticket.evaluations?.find(
        evaluation => evaluation.user?._id === userId
      );

      return (
        <TicketSpecialistActionButtons
          ticket={ticket}
          currentUserEvaluation={currentUserEvaluation}
        />
      );
    }

    case EUserRole.USER:
      return <TicketUserActionButtons ticket={ticket} />;
  }
}
