'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import TicketCarouselCard from './TicketCarouselCard';
import { Button } from '@/components/shadcn/button';
import { Typography } from '../common/Typography';
import { useState } from 'react';
import { ETicketCategory, ETicketStatus } from '@/constants/ticket';
import TicketCreateDialog from './TicketCreateDialog';
import CategorySelect from './CategorySelect';
import { useGetTicketsQuery } from '@/api/ticketingApi';
import { LoadingSpinner } from '../shadcn/loading-spinner';
import { EFallbackKey } from '@/constants/enums';
import { notFound } from 'next/navigation';

export default function TicketCarousel() {
  const [categoryFilter, setCategoryFilter] = useState<ETicketCategory | null>(null);
  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  const { data: userTickets = [], isLoading, isError, refetch } = useGetTicketsQuery();

  // TODO: error page component to be created
  if (isError) {
    notFound();
  }

  const ticketList = categoryFilter
    ? userTickets.filter(ticket => ticket.category === categoryFilter)
    : userTickets;

  return isLoading ? (
    // TODO: skeleton loader to be added
    <div className="flex h-[420px] items-center justify-center">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">Twoje sprawy: {userTickets.length}</Typography>
      <div className="flex justify-between">
        <CategorySelect
          selectedCategory={categoryFilter}
          setSelectedCategory={setCategoryFilter}
          resetSelectedCategory={() => setCategoryFilter(null)}
        />
        {categoryFilter ? (
          <Typography variant="small" className="self-end text-neutral-50">
            Ilość: {ticketList.length}
          </Typography>
        ) : null}
      </div>
      <Carousel className="w-full cursor-pointer overflow-visible">
        <CarouselContent overflowHidden={false}>
          {ticketList.map((ticket, index) => (
            <CarouselItem
              key={ticket._id ?? `${EFallbackKey.TICKET_CAROUSEL}-${index}`}
              className="select-none pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 [&:not(:first-of-type)]:pl-2"
            >
              <TicketCarouselCard
                title={ticket.title}
                description={ticket.description}
                assignee={ticket.assignee}
                status={ticket.status as ETicketStatus}
                category={ticket.category as ETicketCategory}
                price={ticket.price}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Button
        variant="secondary"
        className="bg-info-50"
        onClick={() => setTicketCreateDialog(true)}
      >
        Utwórz sprawę
      </Button>
      <TicketCreateDialog
        open={ticketCreateDialog}
        refetchTickets={refetch}
        closeDialog={() => setTicketCreateDialog(false)}
      />
    </div>
  );
}
