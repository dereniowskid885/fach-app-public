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
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { GetTicketsByIdByIdApiResponse, useGetCategoriesQuery } from '@/api/accountApi';
import { EFallbackKey } from '@/constants/enums';

export interface ICategorySelect {
  selectedCategory: GetTicketsByIdByIdApiResponse['category'] | null;
  setSelectedCategory: Dispatch<SetStateAction<GetTicketsByIdByIdApiResponse['category'] | null>>;
  resetSelectedCategory?: () => void;
}

export default function CategorySelect({
  selectedCategory,
  setSelectedCategory,
  resetSelectedCategory
}: ICategorySelect) {
  const [open, setOpen] = useState<boolean>(false);

  const { data: ticketCategories = [] } = useGetCategoriesQuery();

  const selectCategoryHandler = (newCategory: GetTicketsByIdByIdApiResponse['category']) => {
    const isCategoryChange = newCategory?._id !== selectedCategory?._id;

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
              <CategoryIcon category={selectedCategory.name} />
              {selectedCategory.name}
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
              {ticketCategories.map((category, index) => (
                <CommandItem
                  key={category._id ?? `${EFallbackKey.TICKET_CATEGORY}-${index}`}
                  value={category.name}
                  onSelect={() => selectCategoryHandler(category)}
                >
                  <CategoryIcon category={category.name} />
                  {category.name}
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
