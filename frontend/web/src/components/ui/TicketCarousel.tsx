'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import TicketCarouselCard from './TicketCarouselCard';
import { ETicketStatus } from '@/constants/ticket';
import { EFallbackKey, EUserRole } from '@/constants/enums';
import { GetTicketsApiResponse } from '@/api/ticketingApi';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export interface ITicketCarousel {
  tickets: GetTicketsApiResponse;
}

export default function TicketCarousel({ tickets }: ITicketCarousel) {
  const { role } = useAppSelector(selectUserData);

  return (
    <Carousel className="w-full cursor-pointer overflow-visible">
      <CarouselContent overflowHidden={false}>
        {tickets.map((ticket, index) => (
          <CarouselItem
            key={ticket._id ?? `${EFallbackKey.TICKET_CAROUSEL}-${index}`}
            className="select-none pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 [&:not(:first-of-type)]:pl-2"
          >
            <TicketCarouselCard
              role={role as EUserRole}
              id={ticket._id}
              title={ticket.title}
              description={ticket.description}
              city={ticket.city}
              assignee={ticket.assignee}
              status={ticket.status as ETicketStatus}
              category={ticket.category}
              price={ticket.price}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
