import { EUserRole } from 'shared-types';
import IconBadge from '@/components/ui/IconBadge';
import { EIconBadgeVariant } from '@/enums/ui';
import { Skeleton } from '@/components/shadcn/skeleton';
import { UserRole } from '@/services/api/generated/accountApi';

export interface IUserRoleBadge {
  role?: UserRole | EUserRole;
  className?: string;
}

export default function UserRoleBadge({ role, className }: IUserRoleBadge) {
  let variant;

  switch (role) {
    case EUserRole.SPECIALIST:
      variant = EIconBadgeVariant.SPECIALIST;
      break;
    case EUserRole.ADMIN:
      variant = EIconBadgeVariant.ADMIN;
      break;
    case EUserRole.USER:
      variant = EIconBadgeVariant.USER;
      break;
    default:
      variant = EIconBadgeVariant.USER;
  }

  return role ? (
    <IconBadge variant={variant} text={role} showIcon={false} className={className} />
  ) : (
    <Skeleton className="h-5.5 w-16" />
  );
}
