import { EUserBadgeVariant } from '@/enums/ui';
import { Badge, BadgeProps } from '../shadcn/badge';
import { useTranslations } from 'next-intl';
import { Layers, MapPin } from 'lucide-react';
import { cn } from '@/utils/shared';
import Typography from '../common/Typography';

export interface IUserBadge {
  variant: EUserBadgeVariant;
  className?: string;
  text: string;
}

export default function UserBadge({ variant, className = '', text }: IUserBadge) {
  const t = useTranslations();

  const badgeObj = {
    [EUserBadgeVariant.CATEGORY]: {
      variantName: 'category',
      title: t('common.category'),
      badgeClasses: 'border-blue-200 bg-blue-50',
      iconClasses: 'text-blue-600',
      icon: Layers
    },
    [EUserBadgeVariant.CITY]: {
      variantName: 'city',
      title: t('common.city'),
      badgeClasses: 'border-emerald-200 bg-emerald-50',
      iconClasses: 'text-emerald-600',
      icon: MapPin
    }
  };

  const badge = badgeObj[variant];
  const Icon = badge.icon;

  return (
    <Badge
      variant={badge.variantName as BadgeProps['variant']}
      className={cn('space-x-2 border', badge.badgeClasses, className)}
      title={badge.title}
    >
      <Icon size={12} className={badge.iconClasses} />

      <Typography variant="note">{text}</Typography>
    </Badge>
  );
}
