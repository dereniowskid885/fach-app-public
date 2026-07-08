import { User } from '@/services/api/generated/accountApi';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useTranslations } from 'next-intl';
import { getUserFullName } from '@/utils/shared';
import ContentSection from '@/components/ui/ContentSection';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import { isSpecialist } from 'shared-types';
import { ESectionItemType } from '@/enums/ui';
import UserRoleBadge from './UserRoleBadge';
import { cn } from '@/lib/utils';

export interface IUserCard {
  user?: Partial<User> | null;
  userNameFallback?: string;
  userNameTextWrap?: boolean;
  isSidebarCollapsed?: boolean;
  className?: string;
  titleClass?: string;
  descriptionClass?: string;
}

export default function UserCard({
  user,
  userNameFallback,
  userNameTextWrap = false,
  isSidebarCollapsed = false,
  className,
  titleClass = '',
  descriptionClass = ''
}: IUserCard) {
  const t = useTranslations();

  const isUsernameFallback = !!userNameFallback && !user;
  const userName = user?.name ? getUserFullName(user) : undefined;
  const shouldHideBottomInfo = isSidebarCollapsed || (!user?.city && !user?.category);

  return (
    <ContentSection
      bgTransparent={true}
      className={cn(isSidebarCollapsed ? 'p-0' : 'p-3', className)}
    >
      <ContentSectionItem
        hideContent={isSidebarCollapsed}
        title={isUsernameFallback ? userNameFallback : userName}
        titleClass={cn(
          'text-foreground font-bold text-sm mb-1',
          userNameTextWrap ? 'text-pretty' : '',
          titleClass
        )}
        descriptionComponent={
          user ? <UserRoleBadge role={user.role} className={cn('ml-3', descriptionClass)} /> : <></>
        }
        descriptionClass={descriptionClass}
        iconComponent={
          user === undefined ? (
            <Skeleton className="size-10 rounded-full" />
          ) : (
            <div className="bg-card flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold uppercase shadow-xs">
              {`${user?.name?.charAt(0) ?? 'U'}${user?.surname?.charAt(0) ?? 'A'}`}
            </div>
          )
        }
        className={isSidebarCollapsed ? 'mr-2 justify-center' : ''}
      />

      {shouldHideBottomInfo ? null : (
        <div className="space-y-4">
          <ContentSectionItem
            title={t('common.city')}
            titleClass="text-xs"
            description={user.city}
            descriptionClass="text-xs"
            variant={ESectionItemType.CITY}
          />

          {isSpecialist(user.role) && user.category?.name ? (
            <ContentSectionItem
              title={t('common.category')}
              titleClass="text-xs"
              description={user.category.name}
              descriptionClass="text-xs"
              variant={ESectionItemType.CATEGORY}
            />
          ) : null}
        </div>
      )}
    </ContentSection>
  );
}
