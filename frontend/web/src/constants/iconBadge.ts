import { EIconBadgeVariant } from '@/enums/ui';
import { Layers, MapPin } from 'lucide-react';
import { roleObj } from './role';
import { EUserRole } from 'shared-types/enums/role';

export const iconBadgeObj = {
  [EIconBadgeVariant.CATEGORY]: {
    variantName: 'category',
    iconWrapperClass: 'border-blue-200 bg-blue-50',
    iconClass: 'text-blue-600',
    icon: Layers
  },
  [EIconBadgeVariant.CITY]: {
    variantName: 'city',
    iconWrapperClass: 'border-emerald-200 bg-emerald-50',
    iconClass: 'text-emerald-600',
    icon: MapPin
  },
  [EIconBadgeVariant.USER]: {
    variantName: 'user',
    iconWrapperClass: roleObj[EUserRole.USER].wrapperClass,
    iconClass: roleObj[EUserRole.USER].textClass,
    icon: Layers
  },
  [EIconBadgeVariant.SPECIALIST]: {
    variantName: 'specialist',
    iconWrapperClass: roleObj[EUserRole.SPECIALIST].wrapperClass,
    iconClass: roleObj[EUserRole.SPECIALIST].textClass,
    icon: Layers
  },
  [EIconBadgeVariant.ADMIN]: {
    variantName: 'admin',
    iconWrapperClass: roleObj[EUserRole.ADMIN].wrapperClass,
    iconClass: roleObj[EUserRole.ADMIN].textClass,
    icon: Layers
  }
};
