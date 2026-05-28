import { GiMechanicGarage } from 'react-icons/gi';
import { MdDevices } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';
import { Layers } from 'lucide-react';

export interface ITicketCategoryIcon {
  categoryName?: string;
}

export default function TicketCategoryIcon({ categoryName = '' }: ITicketCategoryIcon) {
  // TODO: categories icon approach to be changed
  switch (categoryName) {
    case 'Mechanika pojazdowa':
      return <GiMechanicGarage size={40} />;
    case 'Elektronika':
      return <MdDevices size={40} />;
    case 'Dom':
      return <IoHome size={40} />;
    default:
      return <Layers size={40} />;
  }
}
