'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import { tickets } from '@/mocks/tickets';
import TicketCarouselCard from './TicketCarouselCard';
import { Button } from '@/components/shadcn/button';
import { Typography } from './Typography';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/shadcn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ETicketCategory, ticketCategories } from '@/constants/ticket';
import { BiSolidCategory } from 'react-icons/bi';
import CategoryIcon from '../utilities/CategoryIcon';

export default function TicketCarousel() {
  const [open, setOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<ETicketCategory | null>(null);

  const ticketList = categoryFilter
    ? tickets.filter(ticket => ticket.category === categoryFilter)
    : tickets;

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h3">Twoje sprawy: {tickets.length}</Typography>
      <div className="flex justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {categoryFilter ? (
                <>
                  <CategoryIcon category={categoryFilter} />
                  {categoryFilter}
                </>
              ) : (
                'Wyszukaj kategorie'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj kategorie" />
              <CommandList>
                <CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
                <CommandGroup defaultValue="all">
                  <CommandItem
                    onSelect={() => {
                      setCategoryFilter(null);
                      setOpen(false);
                    }}
                  >
                    <BiSolidCategory />
                    Wszystkie
                  </CommandItem>
                  {ticketCategories.map((category, i) => (
                    <CommandItem
                      key={i}
                      value={category}
                      onSelect={value => {
                        const selectedCategory = value as ETicketCategory;

                        if (selectedCategory !== categoryFilter) {
                          setCategoryFilter(selectedCategory);
                        }

                        setOpen(false);
                      }}
                    >
                      <CategoryIcon category={category} />
                      {category}
                      <Check
                        className={cn(
                          'ml-auto',
                          category === categoryFilter ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
      <Button variant="secondary" className="bg-info-50">
        Utwórz sprawę
      </Button>
    </div>
  );
}
