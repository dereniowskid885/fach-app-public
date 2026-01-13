import { GiMechanicGarage } from 'react-icons/gi';
import { MdDevices } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';
import { TbCategory } from 'react-icons/tb';

export interface ICategoryIcon {
  categoryName?: string;
}

export default function CategoryIcon({ categoryName = '' }: ICategoryIcon) {
  // TODO: categories icon approach to be changed
  switch (categoryName) {
    case 'Mechanika pojazdowa':
      return <GiMechanicGarage size={40} />;
    case 'Elektronika':
      return <MdDevices size={40} />;
    case 'Dom':
      return <IoHome size={40} />;
    default:
      return <TbCategory size={40} />;
  }
}
