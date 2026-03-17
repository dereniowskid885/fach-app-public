import { Dispatch, SetStateAction } from 'react';
import ButtonsCarousel from '../common/ButtonsCarousel';
import { EFallbackKey } from '@/constants/enums';
import { useTranslations } from 'next-intl';
import { cities } from '@shared/constants/mocks';

export interface ITicketCityFilter {
  selectedCity: string | null;
  setSelectedCity: Dispatch<SetStateAction<string | null>>;
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

  const selectCityHandler = (newCityId: string | null) => {
    const isCityChange = newCityId !== selectedCityData?.id;

    if (isCityChange) {
      const newSelectedCityData = carouselData.find(item => item.id === newCityId);

      setSelectedCity(newSelectedCityData?.name ?? null);
    }
  };

  return (
    <ButtonsCarousel
      items={carouselData}
      selectedItemId={selectedCityData?.id ?? null}
      selectItemHandler={selectCityHandler}
      headerText={showHeader ? t('buttonsCarousel.cityFilterHeader') : undefined}
    />
  );
}
