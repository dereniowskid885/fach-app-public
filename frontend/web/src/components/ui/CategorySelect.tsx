'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { Button } from '../shadcn/button';
import CategoryIcon from './CategoryIcon';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/shadcn/command';
import { Check } from 'lucide-react';
import { cn } from '@/utils/shared';
import { Dispatch, SetStateAction, useState } from 'react';
import { Category, useGetCategoriesQuery } from '@/api/accountApi';
import { EFallbackKey } from '@/enums/ui';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ICategorySelect {
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
}

export default function CategorySelect({ selectedCategory, setSelectedCategory }: ICategorySelect) {
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
              {getCategoriesResponse?.success &&
                getCategoriesResponse?.data?.map((category, index) => (
                  <CommandItem
                    key={category._id ?? `${EFallbackKey.CATEGORY_SELECT_ITEM}-${index}`}
                    value={category.name}
                    disabled={!category.name}
                    onSelect={() => selectCategoryHandler(category)}
                  >
                    <CategoryIcon categoryName={category.name} />

                    {category.name ? category.name : t('category.unknown')}

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
