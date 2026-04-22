import { ETicketStatus } from 'shared-types';
import ButtonsCarousel from '../common/ButtonsCarousel';
import TicketStatusIcon from './TicketStatusIcon';
import { useTranslations } from 'next-intl';
import { getTicketStatusTranslationKey } from '@/helpers/ticket';
import { EFallbackKey, EFilterButton } from '@/enums/ui';

export interface ITicketStatusFilter {
  statuses: ETicketStatus[];
  selectedStatus: ETicketStatus | EFilterButton.ALL;
  setSelectedStatus: (status: ETicketStatus | EFilterButton.ALL) => void;
  showHeader?: boolean;
}

export default function TicketStatusFilter({
  statuses,
  selectedStatus,
  setSelectedStatus,
  showHeader = false
}: ITicketStatusFilter) {
  const t = useTranslations();

  const carouselData = statuses.map((status: ETicketStatus, index: number) => ({
    id: `${EFallbackKey.TICKET_STATUS_FILTER_ITEM}-${index}`,
    enum: status,
    name: t(getTicketStatusTranslationKey(status)),
    icon: <TicketStatusIcon status={status} className="p-1" />
  }));

  const selectedStatusData = carouselData.find(item => item.enum === selectedStatus);

  const selectStatusHandler = (newStatusId: string | EFilterButton.ALL) => {
    const isStatusChange = newStatusId !== selectedStatusData?.id;

    if (isStatusChange) {
      const newSelectedStatusData = carouselData.find(item => item.id === newStatusId);

      setSelectedStatus(newSelectedStatusData?.enum ?? EFilterButton.ALL);
    }
  };

  return (
    <ButtonsCarousel
      items={carouselData}
      itemFallbackKey={EFallbackKey.TICKET_STATUS_FILTER_ITEM}
      selectedItemId={selectedStatusData?.id ?? EFilterButton.ALL}
      selectItemHandler={selectStatusHandler}
      headerText={showHeader ? t('buttonsCarousel.statusFilterHeader') : undefined}
    />
  );
}
