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
import { Category, useGetCategoriesQuery } from '@/api/accountApi';
import { EFallbackKey } from '@/constants/enums';
import { useTranslations } from 'next-intl';

export interface ICategorySelect {
  selectedCategory: Category | null;
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>;
  resetSelectedCategory?: () => void;
}

export default function CategorySelect({
  selectedCategory,
  setSelectedCategory,
  resetSelectedCategory
}: ICategorySelect) {
  const t = useTranslations();

  const [open, setOpen] = useState<boolean>(false);

  const { data: getCategoriesResponse } = useGetCategoriesQuery({});

  const selectCategoryHandler = (newCategory: Category) => {
    const isCategoryChange = newCategory._id !== selectedCategory?._id;

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
              <CategoryIcon categoryName={selectedCategory.name} />

              {selectedCategory.name}
            </>
          ) : (
            t('category.select')
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[99] p-0">
        <Command>
          <CommandInput placeholder={t('common.search')} />
          <CommandList>
            <CommandEmpty>{t('category.noResults')}</CommandEmpty>
            <CommandGroup defaultValue="all">
              {resetSelectedCategory ? (
                <CommandItem
                  onSelect={() => {
                    resetSelectedCategory();
                    setOpen(false);
                  }}
                >
                  <BiSolidCategory />

                  {t('common.all')}
                </CommandItem>
              ) : null}
              {getCategoriesResponse?.success &&
                getCategoriesResponse?.data?.map((category, index) => (
                  <CommandItem
                    key={category._id ?? `${EFallbackKey.TICKET_CATEGORY}-${index}`}
                    value={category.name}
                    onSelect={() => selectCategoryHandler(category)}
                  >
                    <CategoryIcon categoryName={category.name} />

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
