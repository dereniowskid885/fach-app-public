import { ENotificationType } from '@/enums/notification';
import { BiBell, BiMessageDetail, BiWrench, BiUser } from 'react-icons/bi';

export interface INotificationIcon {
  type: ENotificationType;
}

export default function NotificationIcon({ type }: INotificationIcon) {
  switch (type) {
    case ENotificationType.RESPONSE:
      return <BiMessageDetail size={25} className="text-primary-500" />;
    case ENotificationType.STATUS:
      return <BiWrench size={25} className="text-secondary-500" />;
    case ENotificationType.NEW:
      return <BiUser size={25} className="text-accent-500" />;
    default:
      return <BiBell size={25} className="text-neutral-500" />;
  }
}
