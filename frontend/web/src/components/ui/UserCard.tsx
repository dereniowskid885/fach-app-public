import { User } from '@/api/accountApi';
import { Skeleton } from '../shadcn/skeleton';
import Typography from '../common/Typography';
import { useTranslations } from 'next-intl';
import { cn, getUserFullName } from '@/utils/shared';

export interface IUserCard {
  user?: Partial<User>;
  isSidebarCollapsed?: boolean;
  showBackground?: boolean;
}

export default function UserCard({
  user,
  isSidebarCollapsed = false,
  showBackground = false
}: IUserCard) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        showBackground ? 'rounded-xl bg-background p-3 shadow-md' : 'bg-transparent'
      )}
    >
      {user?.name && user?.surname ? (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card text-xs font-bold uppercase shadow-sm">
          {`${user.name.charAt(0)}${user.surname.charAt(0)}`}
        </div>
      ) : (
        <Skeleton className="h-[32px] w-[32px] rounded-full" />
      )}

      {isSidebarCollapsed ? null : (
        <div className="flex flex-col gap-1">
          {user ? (
            <Typography variant="note" className="text-nowrap font-bold">
              {getUserFullName(user)}
            </Typography>
          ) : (
            <Skeleton className="h-[16px] w-[100px]" />
          )}

          {user?.role ? (
            <Typography variant="note" className="font-semibold text-muted-foreground">
              {t(`userRole.${user.role}`)}
            </Typography>
          ) : (
            <Skeleton className="h-[16px] w-[100px]" />
          )}
        </div>
      )}
    </div>
  );
}
