import { ETicketCategory } from '@/constants/ticket';
import { GiMechanicGarage } from 'react-icons/gi';
import { MdDevices } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';

export interface ICategoryIcon {
  category: ETicketCategory;
}

export default function CategoryIcon({ category }: ICategoryIcon) {
  switch (category) {
    case ETicketCategory.AUTOMOTIVE:
      return <GiMechanicGarage size={40} />;
    case ETicketCategory.ELECTRONICS:
      return <MdDevices size={40} />;
    case ETicketCategory.HOME:
      return <IoHome size={40} />;
  }
}
