import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import { TicketDetailsSpecialistConfirmButtons } from './TicketDetailsSpecialistConfirmButtons';
import { TicketDetailsUserConfirmButtons } from './TicketDetailsUserConfirmButtons';
import { TicketDetailsAdminConfirmButtons } from './TicketDetailsAdminConfirmButtons';

export interface ITicketDetailsConfirmButtons {
  ticket: Ticket;
  userId?: string;
  role: EUserRole | string;
}

export default function TicketDetailsConfirmButtons({
  ticket,
  userId,
  role
}: ITicketDetailsConfirmButtons) {
  switch (role) {
    case EUserRole.SPECIALIST: {
      const currentUserEvaluation = ticket.evaluations?.find(
        evaluation => evaluation.user?._id === userId
      );

      return (
        <TicketDetailsSpecialistConfirmButtons
          ticket={ticket}
          currentUserEvaluation={currentUserEvaluation}
        />
      );
    }

    case EUserRole.USER:
      return <TicketDetailsUserConfirmButtons ticket={ticket} />;

    case EUserRole.ADMIN:
      return <TicketDetailsAdminConfirmButtons ticket={ticket} />;
  }
}
