import { roleObj } from '@/constants/role';
import { BiBell, BiMessageDetail, BiWrench, BiCheckCircle } from 'react-icons/bi';
import { RiUserForbidLine } from 'react-icons/ri';
import { ENotificationType, EUserRole } from 'shared-types';
import { MdOutlinePayments, MdOutlineAdminPanelSettings } from 'react-icons/md';

export interface INotificationIcon {
  type: ENotificationType;
}

export default function NotificationIcon({ type }: INotificationIcon) {
  switch (type) {
    case ENotificationType.COMMENT_ADDED:
      return <BiMessageDetail size={24} className="text-primary-500" />;

    case ENotificationType.ADMIN_TICKET_ASSIGNEE_UPDATED:
    case ENotificationType.ADMIN_TICKET_CITY_UPDATED:
    case ENotificationType.ADMIN_TICKET_DETAILS_UPDATED:
    case ENotificationType.ADMIN_TICKET_STATUS_UPDATED:
    case ENotificationType.ADMIN_TICKET_CATEGORY_UPDATED:
    case ENotificationType.ADMIN_TICKET_DELETED:
      return (
        <MdOutlineAdminPanelSettings size={24} className={roleObj[EUserRole.ADMIN].textClass} />
      );

    case ENotificationType.SPECIALIST_EVALUATION_ADDED:
    case ENotificationType.SPECIALIST_EVALUATION_EDITED:
    case ENotificationType.SPECIALIST_SEND_FOR_REVIEW:
      return <BiWrench size={24} className={roleObj[EUserRole.SPECIALIST].textClass} />;

    case ENotificationType.USER_EVALUATION_ACCEPTED:
    case ENotificationType.USER_SOLUTION_ACCEPTED:
      return <BiCheckCircle size={24} className={roleObj[EUserRole.USER].textClass} />;

    case ENotificationType.USER_SOLUTION_REJECTED:
      return <RiUserForbidLine size={24} className="text-destructive" />;

    case ENotificationType.USER_TICKET_PAYMENT_DONE:
      return <MdOutlinePayments size={24} className={roleObj[EUserRole.USER].textClass} />;

    default:
      return <BiBell size={24} className="text-neutral-500" />;
  }
}
