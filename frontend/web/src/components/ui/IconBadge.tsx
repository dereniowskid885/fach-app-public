import { EIconBadgeVariant } from '@/enums/ui';
import { Badge, BadgeProps } from '../shadcn/badge';
import { cn } from '@/lib/utils';
import Typography from './Typography';
import { iconBadgeObj } from '@/constants/iconBadge';

export interface IIconBadge {
  variant: EIconBadgeVariant;
  className?: string;
  text: string;
  textClassName?: string;
  showIcon?: boolean;
}

export default function IconBadge({
  variant,
  className = '',
  text,
  textClassName,
  showIcon = true
}: IIconBadge) {
  const badge = iconBadgeObj[variant];
  const Icon = badge.icon;

  return (
    <Badge
      variant={badge.variantName as BadgeProps['variant']}
      className={cn('space-x-1 border', badge.iconWrapperClass, className)}
      title={text}
    >
      {showIcon ? <Icon size={12} strokeWidth={2.5} className={badge.iconClass} /> : null}

      <Typography variant="note" className={cn('font-bold', textClassName, badge.iconClass)}>
        {text}
      </Typography>
    </Badge>
  );
}
