import { ETicketStatus } from '@shared/constants/enums';
import ButtonsCarousel from '../common/ButtonsCarousel';
import TicketStatusIcon from './TicketStatusIcon';
import { useTranslations } from 'next-intl';
import { getTicketStatusTranslationKey } from '@/lib/ticketUtils';
import { EFallbackKey } from '@/constants/enums';

export interface ITicketStatusFilter {
  statuses: ETicketStatus[];
  selectedStatus: ETicketStatus | null;
  setSelectedStatus: (status: ETicketStatus | null) => void;
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

  const selectStatusHandler = (newStatusId: string | null) => {
    const isStatusChange = newStatusId !== selectedStatusData?.id;

    if (isStatusChange) {
      const newSelectedStatusData = carouselData.find(item => item.id === newStatusId);

      setSelectedStatus(newSelectedStatusData?.enum ?? null);
    }
  };

  return (
    <ButtonsCarousel
      items={carouselData}
      selectedItemId={selectedStatusData?.id ?? null}
      selectItemHandler={selectStatusHandler}
      headerText={showHeader ? t('buttonsCarousel.statusFilterHeader') : undefined}
    />
  );
}
