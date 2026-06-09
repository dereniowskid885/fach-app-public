import { Dispatch, SetStateAction } from 'react';
import ButtonsCarousel from '@/components/features/ticket/ButtonsCarousel';
import { useTranslations } from 'next-intl';
import { cities } from 'shared-types';
import { EFallbackKey, EFilterButton } from '@/enums/ui';

export interface ITicketCityFilter {
  selectedCity: string | EFilterButton.ALL;
  setSelectedCity: Dispatch<SetStateAction<string | EFilterButton.ALL | undefined>>;
  showHeader?: boolean;
}

export default function TicketCityFilter({
  selectedCity,
  setSelectedCity,
  showHeader = false
}: ITicketCityFilter) {
  const t = useTranslations();

  // TODO: fix on api usage instead of mock
  const carouselData =
    cities.map((city: string, index: number) => ({
      id: `${EFallbackKey.TICKET_CITY_FILTER_ITEM}-${index}`,
      name: city
    })) ?? [];

  const selectedCityData = carouselData.find(item => item.name === selectedCity);

  const selectCityHandler = (newCityId: string | EFilterButton.ALL) => {
    const isCityChange = newCityId !== selectedCityData?.id;

    if (isCityChange) {
      const newSelectedCityData = carouselData.find(item => item.id === newCityId);

      setSelectedCity(newSelectedCityData?.name ?? EFilterButton.ALL);
    }
  };

  return (
    <ButtonsCarousel
      items={carouselData}
      itemFallbackKey={EFallbackKey.TICKET_CITY_FILTER_ITEM}
      selectedItemId={selectedCityData?.id ?? EFilterButton.ALL}
      selectItemHandler={selectCityHandler}
      headerText={showHeader ? t('buttonsCarousel.cityFilterHeader') : undefined}
    />
  );
}
