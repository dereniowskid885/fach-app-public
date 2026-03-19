import { User } from '@/api/accountApi';
import { Skeleton } from '../shadcn/skeleton';
import Typography from '../common/Typography';
import { useTranslations } from 'next-intl';
import { cn, getUserFullName } from '@/utils/shared';
import { Layers, MapPin } from 'lucide-react';
import { Separator } from '../shadcn/separator';

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
  const userName = getUserFullName(user, '');
  const shouldHideBottomInfo = isSidebarCollapsed || (!user?.city && !user?.category);

  return (
    <div
      className={cn(
        'space-y-3',
        showBackground ? 'rounded-xl bg-background p-3 shadow-md' : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-3">
        {user?.name && user?.surname ? (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card text-xs font-bold uppercase shadow-sm">
            {`${user.name.charAt(0)}${user.surname.charAt(0)}`}
          </div>
        ) : (
          <Skeleton className="h-[32px] w-[32px] rounded-full" />
        )}

        {isSidebarCollapsed ? null : (
          <div className="flex flex-col gap-1">
            {userName ? (
              <Typography variant="note" className="text-nowrap font-bold">
                {userName}
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

      {shouldHideBottomInfo ? null : (
        <>
          <Separator className="bg-border" />

          <div className="ml-1 space-y-3">
            <div className="flex items-center gap-3">
              {user?.city ? (
                <div className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50">
                  <MapPin size={12} className="text-emerald-600" />
                </div>
              ) : (
                <Skeleton className="h-[28px] w-[28px] rounded-full" />
              )}

              <div className="flex flex-col gap-1">
                {user?.city ? (
                  <Typography variant="note" className="text-nowrap font-bold">
                    {t('userCard.city')}
                  </Typography>
                ) : (
                  <Skeleton className="h-[16px] w-[60px]" />
                )}

                {user?.city ? (
                  <Typography variant="note" className="font-semibold text-muted-foreground">
                    {user.city}
                  </Typography>
                ) : (
                  <Skeleton className="h-[16px] w-[60px]" />
                )}
              </div>
            </div>

            {user.category?.name ? (
              <div className="flex items-center gap-3">
                <div className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50">
                  <Layers size={12} className="text-blue-600" />
                </div>

                <div className="flex flex-col gap-1">
                  <Typography variant="note" className="text-nowrap font-bold">
                    {t('userCard.category')}
                  </Typography>

                  <Typography variant="note" className="font-semibold text-muted-foreground">
                    {user.category.name}
                  </Typography>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
