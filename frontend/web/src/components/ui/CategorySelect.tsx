'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { Button } from '../shadcn/button';
import CategoryIcon from './CategoryIcon';
import { BiSolidCategory } from 'react-icons/bi';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/shadcn/command';
import { ETicketCategory, ticketCategories } from '@/constants/ticket';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';

export interface ICategorySelect {
  selectedCategory: ETicketCategory | null;
  setSelectedCategory: Dispatch<SetStateAction<ETicketCategory | null>>;
  resetSelectedCategory?: () => void;
}

export default function CategorySelect({
  selectedCategory,
  setSelectedCategory,
  resetSelectedCategory
}: ICategorySelect) {
  const [open, setOpen] = useState<boolean>(false);

  const selectCategoryHandler = (newCategory: ETicketCategory) => {
    const isCategoryChange = newCategory !== selectedCategory;

    if (isCategoryChange) {
      setSelectedCategory(newCategory);
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          {selectedCategory ? (
            <>
              <CategoryIcon category={selectedCategory} />
              {selectedCategory}
            </>
          ) : (
            'Wyszukaj kategorie'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[99] p-0">
        <Command>
          <CommandInput placeholder="Wyszukaj kategorie" />
          <CommandList>
            <CommandEmpty>Nie znaleziono kategorii</CommandEmpty>
            <CommandGroup defaultValue="all">
              {resetSelectedCategory ? (
                <CommandItem
                  onSelect={() => {
                    resetSelectedCategory();
                    setOpen(false);
                  }}
                >
                  <BiSolidCategory />
                  Wszystkie
                </CommandItem>
              ) : null}
              {ticketCategories.map((category, i) => (
                <CommandItem
                  key={i}
                  value={category}
                  onSelect={category => selectCategoryHandler(category as ETicketCategory)}
                >
                  <CategoryIcon category={category} />
                  {category}
                  <Check
                    className={cn(
                      'ml-auto',
                      category === selectedCategory ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
