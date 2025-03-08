'use client';

import { Button } from '../shadcn/button';
import { ETicketStatus } from '@/constants/ticket';
import { TStatusActionButton } from './UserTicketCarouselCardButtons';

export interface ISpecialistTicketCarouselCardButtons {
  ticketStatus: ETicketStatus;
}

export const SpecialistTicketCarouselCardButtons = ({
  ticketStatus
}: ISpecialistTicketCarouselCardButtons) => {
  const statusActionButton: TStatusActionButton = {
    [ETicketStatus.IN_PROGRESS]: {
      title: 'Odpowiedz',
      handler: () => null
    },
    [ETicketStatus.PRICE_EVALUATION]: {
      title: 'Wyceń',
      handler: () => null
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {statusActionButton[ticketStatus] ? (
        <Button variant="default" onClick={statusActionButton[ticketStatus].handler}>
          {statusActionButton[ticketStatus].title}
        </Button>
      ) : null}
    </div>
  );
};
