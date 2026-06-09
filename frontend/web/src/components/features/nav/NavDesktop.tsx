import { normalizePathname } from '@/utils/pathname';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import NavLink from './NavLink';
import { ESupportedLanguages, EUserRole } from 'shared-types';
import { EDevice } from '@/enums/shared';
import { Skeleton } from '../../shadcn/skeleton';
import { EFallbackKey } from '@/enums/ui';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { menuItemsObj } from '@/constants/menu';

export interface INavDesktop {
  isSidebarCollapsed?: boolean;
}

export default function NavDesktop({ isSidebarCollapsed = false }: INavDesktop) {
  const t = useTranslations();
  const { role } = useSelector(selectUserData);

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  return (
    <nav className="flex-1 space-y-2 overflow-x-hidden overflow-y-auto p-3">
      {role
        ? menuItemsObj[role as EUserRole].map(item => (
            <NavLink
              key={`${EDevice.DESKTOP}-${item.id}`}
              href={item.href}
              isCurrentPath={
                item.path
                  ? item.path[currentLocale as ESupportedLanguages] === normalizedPath
                  : false
              }
              isSidebarCollapsed={isSidebarCollapsed}
              title={t(item.translationKey)}
            >
              <item.icon size={18} strokeWidth={2.5} className="ml-1" />
            </NavLink>
          ))
        : Array.from({ length: 4 }).map((item, index) => (
            <Skeleton key={`${EFallbackKey.MENU_ITEM_SKELETON}-${item}-${index}`} className="h-9" />
          ))}
    </nav>
  );
}
