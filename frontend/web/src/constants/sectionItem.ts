import { ESectionItemType } from '@/enums/ui';
import { Calendar, Clock, DollarSign, Layers, MapPin, User, Wrench } from 'lucide-react';
import { EUserRole } from 'shared-types/enums/role';
import { roleObj } from './role';

export const sectionItemObj = {
  [ESectionItemType.CATEGORY]: {
    variantName: 'category',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Layers
  },
  [ESectionItemType.CITY]: {
    variantName: 'city',
    iconWrapperClass: 'border-emerald-200 bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: MapPin
  },
  [ESectionItemType.USER]: {
    variantName: 'user',
    iconWrapperClass: roleObj[EUserRole.USER].wrapperClass,
    iconClass: roleObj[EUserRole.USER].textClass,
    icon: User
  },
  [ESectionItemType.SPECIALIST]: {
    variantName: 'specialist',
    iconWrapperClass: roleObj[EUserRole.SPECIALIST].wrapperClass,
    iconClass: roleObj[EUserRole.SPECIALIST].textClass,
    icon: Wrench
  },
  [ESectionItemType.DATE_OF_RESPONSE]: {
    variantName: 'dateOfResponse',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Calendar
  },
  [ESectionItemType.RESPONSE_TIME]: {
    variantName: 'responseTime',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Clock
  },
  [ESectionItemType.PRICE]: {
    variantName: 'price',
    iconWrapperClass: 'border-emerald-200 bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: DollarSign
  }
};
