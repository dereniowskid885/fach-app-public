'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { Button } from '@/components/shadcn/button';
import TicketCategoryIcon from './TicketCategoryIcon';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/shadcn/command';
import { Dispatch, SetStateAction, useState } from 'react';
import { Category, useGetCategoriesQuery } from '@/services/api/generated/accountApi';
import { EFallbackKey } from '@/enums/ui';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketCategorySelect {
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
}

export default function TicketCategorySelect({
  selectedCategory,
  setSelectedCategory
}: ITicketCategorySelect) {
  const t = useTranslations();

  const [open, setOpen] = useState<boolean>(false);

  const {
    data: getCategoriesResponse,
    isError,
    error
  } = useGetCategoriesQuery({ hasSpecialists: true });

  useErrorHandler(error);

  const selectCategoryHandler = (newCategory: Category) => {
    const isCategoryChange = newCategory._id !== selectedCategory?._id;

    if (isCategoryChange) {
      setSelectedCategory(newCategory);
    }

    setOpen(false);
  };

  return isError ? null : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          {selectedCategory ? (
            <>
              <TicketCategoryIcon categoryName={selectedCategory.name} />

              {selectedCategory.name}
            </>
          ) : (
            t('category.select')
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-99 p-0">
        <Command>
          <CommandInput placeholder={t('common.search')} />
          <CommandList>
            <CommandEmpty>{t('category.noResults')}</CommandEmpty>
            <CommandGroup defaultValue="all">
              {getCategoriesResponse?.success &&
                getCategoriesResponse?.data?.map((category, index) => (
                  <CommandItem
                    key={category._id ?? `${EFallbackKey.CATEGORY_SELECT_ITEM}-${index}`}
                    value={category.name}
                    disabled={!category.name}
                    onSelect={() => selectCategoryHandler(category)}
                    data-checked={category._id === selectedCategory?._id}
                  >
                    <TicketCategoryIcon categoryName={category.name} />

                    {category.name ? category.name : t('category.unknown')}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
