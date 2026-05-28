import { User } from '@/services/api/generated/accountApi';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useTranslations } from 'next-intl';
import { cn, getUserFullName } from '@/utils/shared';
import { Separator } from '@/components/shadcn/separator';
import ContentSection from '@/components/ui/ContentSection';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import { isSpecialist } from 'shared-types';
import { ESectionItemType } from '@/enums/ui';
import UserRoleBadge from './UserRoleBadge';

export interface IUserCard {
  user?: Partial<User> | null;
  userNameFallback?: string;
  isSidebarCollapsed?: boolean;
  showBackground?: boolean;
  className?: string;
}

export default function UserCard({
  user,
  userNameFallback,
  isSidebarCollapsed = false,
  showBackground = false,
  className
}: IUserCard) {
  const t = useTranslations();

  const isUsernameFallback = !!userNameFallback && !user;
  const userName = user?.name ? getUserFullName(user) : undefined;
  const shouldHideBottomInfo = isSidebarCollapsed || (!user?.city && !user?.category);

  return (
    <ContentSection
      bgTransparent={!showBackground}
      className={cn(className, !showBackground ? 'p-0' : 'p-3')}
    >
      <ContentSectionItem
        hideContent={isSidebarCollapsed}
        title={isUsernameFallback ? userNameFallback : userName}
        titleClass="text-primary font-bold"
        descriptionComponent={user ? <UserRoleBadge role={user.role} className="w-fit" /> : <></>}
        iconComponent={
          user === undefined ? (
            <Skeleton className="h-[32px] w-[32px] rounded-full" />
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border bg-card text-xs font-bold uppercase shadow-sm">
              {`${user?.name?.charAt(0) ?? 'U'}${user?.surname?.charAt(0) ?? 'A'}`}
            </div>
          )
        }
      />

      {shouldHideBottomInfo ? null : (
        <>
          <Separator className="bg-border" />

          <div className="space-y-4">
            <ContentSectionItem
              title={t('common.city')}
              description={user.city}
              variant={ESectionItemType.CITY}
            />

            {isSpecialist(user.role) && user.category?.name ? (
              <ContentSectionItem
                title={t('common.category')}
                description={user.category.name}
                variant={ESectionItemType.CATEGORY}
              />
            ) : null}
          </div>
        </>
      )}
    </ContentSection>
  );
}
