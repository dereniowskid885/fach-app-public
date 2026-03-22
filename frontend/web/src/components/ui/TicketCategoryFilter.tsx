import { Dispatch, SetStateAction } from 'react';
import { Category, useGetCategoriesQuery } from '@/api/accountApi';
import CategoryIcon from './CategoryIcon';
import ButtonsCarousel from '../common/ButtonsCarousel';
import { useTranslations } from 'next-intl';
import { EFallbackKey, EFilterButton } from '@/enums/ui';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketCategoryFilter {
  selectedCategoryId: string | EFilterButton.ALL;
  setSelectedCategoryId: Dispatch<SetStateAction<string | EFilterButton.ALL>>;
  showHeader?: boolean;
}

export default function TicketCategoryFilter({
  selectedCategoryId,
  setSelectedCategoryId,
  showHeader = false
}: ITicketCategoryFilter) {
  const t = useTranslations();

  const {
    data: getCategoriesResponse,
    error,
    isLoading
  } = useGetCategoriesQuery({ hasSpecialists: true });

  useErrorHandler(error);

  const carouselData =
    getCategoriesResponse?.data?.map((category: Category, index: number) => ({
      id: category._id ?? `${EFallbackKey.TICKET_CATEGORY_FILTER_ITEM}-${index}`,
      name: category.name,
      icon: <CategoryIcon categoryName={category.name} />
    })) ?? [];

  const selectCategoryHandler = (newCategoryId: string | EFilterButton.ALL) => {
    const isCategoryChange = newCategoryId !== selectedCategoryId;

    if (isCategoryChange) {
      setSelectedCategoryId(newCategoryId);
    }
  };

  return (
    <ButtonsCarousel
      isDataLoading={isLoading}
      items={carouselData}
      itemFallbackKey={EFallbackKey.TICKET_CATEGORY_FILTER_ITEM}
      selectedItemId={selectedCategoryId}
      selectItemHandler={selectCategoryHandler}
      headerText={showHeader ? t('buttonsCarousel.categoryFilterHeader') : undefined}
    />
  );
}
