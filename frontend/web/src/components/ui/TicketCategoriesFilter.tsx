'use client';

import { Button } from '../shadcn/button';
import { Dispatch, SetStateAction } from 'react';
import { Category, useGetCategoriesQuery } from '@/api/accountApi';
import CategoryIcon from './CategoryIcon';
import { useTranslations } from 'next-intl';

export interface ITicketCategoriesFilter {
  selectedCategory: Category | null;
  setSelectedCategory: Dispatch<SetStateAction<Category | null>>;
  resetSelectedCategory?: () => void;
}

export default function TicketCategoriesFilter({
  selectedCategory,
  setSelectedCategory,
  resetSelectedCategory
}: ITicketCategoriesFilter) {
  const t = useTranslations();

  const { data: getCategoriesResponse, isSuccess } = useGetCategoriesQuery({});

  const selectCategoryHandler = (newCategory: Category) => {
    const isCategoryChange = newCategory._id !== selectedCategory?._id;

    if (isCategoryChange) {
      setSelectedCategory(newCategory);
    }
  };

  return isSuccess ? (
    <div className="group/filter relative">
      <div className="scrollbar-hide no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-2">
        <Button
          variant={selectedCategory ? 'secondary' : 'special-2'}
          onClick={resetSelectedCategory}
          className={
            'shrink-0 whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold transition-all'
          }
        >
          {t('common.all')}
        </Button>

        {getCategoriesResponse?.data?.map(category => (
          <Button
            variant={selectedCategory?._id === category._id ? 'special-2' : 'secondary'}
            key={category._id}
            onClick={() => selectCategoryHandler(category)}
            className={
              'shrink-0 whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-bold transition-all'
            }
          >
            <CategoryIcon categoryName={category.name} />

            {category.name}
          </Button>
        ))}
      </div>
    </div>
  ) : null;
}
