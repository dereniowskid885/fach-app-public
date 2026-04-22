import { Ticket } from '@/services/api/generated/accountApi';
import { EUserRole } from 'shared-types';
import { TicketDetailsSpecialistConfirmButtons } from './TicketDetailsSpecialistConfirmButtons';
import { TicketDetailsUserConfirmButtons } from './TicketDetailsUserConfirmButtons';
import { Dispatch, SetStateAction } from 'react';

export interface ITicketDetailsConfirmButtons {
  ticket: Ticket;
  userId?: string;
  role: EUserRole | string;
  setDialogErrorMessage: Dispatch<SetStateAction<string | undefined>>;
}

export default function TicketDetailsConfirmButtons({
  ticket,
  userId,
  role,
  setDialogErrorMessage
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
          setDialogErrorMessage={setDialogErrorMessage}
        />
      );
    }

    case EUserRole.USER:
      return <TicketDetailsUserConfirmButtons ticket={ticket} />;
  }
}
