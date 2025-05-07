'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import TicketCarouselCard from './TicketCarouselCard';
import { EFallbackKey } from '@/constants/enums';
import { EUserRole } from '@/constants/userRole';
import { GetTicketsApiResponse } from '@/api/accountApi';
import { useAppSelector } from '@/redux/hooks';
import { selectUserData } from '@/redux/slices/UserDataSlice';

export interface ITicketCarousel {
  tickets: GetTicketsApiResponse;
  disableKeyboardHandler?: boolean;
}

export default function TicketCarousel({ tickets, disableKeyboardHandler }: ITicketCarousel) {
  const { role, email } = useAppSelector(selectUserData);

  return (
    <Carousel
      className="w-full cursor-pointer overflow-visible"
      disableKeyboardHandler={disableKeyboardHandler}
    >
      <CarouselContent overflowHidden={false}>
        {tickets.map((ticket, index) => (
          <CarouselItem
            key={ticket._id ?? `${EFallbackKey.TICKET_CAROUSEL}-${index}`}
            className="select-none pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 [&:not(:first-of-type)]:pl-2"
          >
            <TicketCarouselCard {...ticket} email={email} role={role as EUserRole} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
