import { ESectionItemType } from '@/enums/ui';
import {
  Calendar,
  Clock,
  DollarSign,
  Layers,
  MapPin,
  Palette,
  Search,
  User,
  Wrench
} from 'lucide-react';
import { EUserRole } from 'shared-types/enums/role';
import { roleObj } from './role';

export const sectionItemObj = {
  [ESectionItemType.CATEGORY]: {
    variantName: 'category',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Layers,
    iconSize: 18
  },
  [ESectionItemType.CITY]: {
    variantName: 'city',
    iconWrapperClass: 'border-emerald-200 bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: MapPin,
    iconSize: 18
  },
  [ESectionItemType.USER]: {
    variantName: 'user',
    iconWrapperClass: roleObj[EUserRole.USER].wrapperClass,
    iconClass: roleObj[EUserRole.USER].textClass,
    icon: User,
    iconSize: 18
  },
  [ESectionItemType.SPECIALIST]: {
    variantName: 'specialist',
    iconWrapperClass: roleObj[EUserRole.SPECIALIST].wrapperClass,
    iconClass: roleObj[EUserRole.SPECIALIST].textClass,
    icon: Wrench,
    iconSize: 18
  },
  [ESectionItemType.ADMIN]: {
    variantName: 'admin',
    iconWrapperClass: roleObj[EUserRole.ADMIN].wrapperClass,
    iconClass: roleObj[EUserRole.ADMIN].textClass,
    icon: Search,
    iconSize: 18
  },
  [ESectionItemType.DATE_OF_RESPONSE]: {
    variantName: 'dateOfResponse',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Calendar,
    iconSize: 18
  },
  [ESectionItemType.RESPONSE_TIME]: {
    variantName: 'responseTime',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Clock,
    iconSize: 18
  },
  [ESectionItemType.PRICE]: {
    variantName: 'price',
    iconWrapperClass: 'border-emerald-200 bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: DollarSign,
    iconSize: 18
  },
  [ESectionItemType.SETTINGS_SECURITY]: {
    variantName: 'settingsSecurity',
    iconWrapperClass: roleObj[EUserRole.ADMIN].wrapperClass,
    iconClass: roleObj[EUserRole.ADMIN].textClass,
    icon: Wrench,
    iconSize: 18
  },
  [ESectionItemType.SETTINGS_THEME]: {
    variantName: 'settingsTheme',
    iconWrapperClass: 'h-10 w-10 border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Palette,
    iconSize: 18
  }
};
