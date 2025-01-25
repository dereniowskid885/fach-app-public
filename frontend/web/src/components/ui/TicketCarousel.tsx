'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import { tickets } from '@/mocks/tickets';
import TicketCarouselCard from './TicketCarouselCard';
import { Button } from '@/components/shadcn/button';
import { Typography } from './Typography';
import { useState } from 'react';
import { ETicketCategory } from '@/constants/ticket';
import TicketCreateDialog from './TicketCreateDialog';
import CategorySelect from './CategorySelect';

export default function TicketCarousel() {
  const [categoryFilter, setCategoryFilter] = useState<ETicketCategory | null>(null);
  const [ticketCreateDialog, setTicketCreateDialog] = useState<boolean>(false);

  const ticketList = categoryFilter
    ? tickets.filter(ticket => ticket.category === categoryFilter)
    : tickets;

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">Twoje sprawy: {tickets.length}</Typography>
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
      <Carousel className="w-full overflow-visible">
        <CarouselContent overflowHidden={false}>
          {ticketList.map(ticket => (
            <CarouselItem
              key={ticket.id}
              className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 [&:not(:first-of-type)]:pl-2"
            >
              <TicketCarouselCard
                title={ticket.title}
                description={ticket.description}
                assignee={ticket.assignee}
                status={ticket.status}
                category={ticket.category}
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
        cancelButtonHandler={() => setTicketCreateDialog(false)}
      />
    </div>
  );
}
