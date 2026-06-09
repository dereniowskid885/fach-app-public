'use client';

import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { normalizePathname } from '@/utils/pathname';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/shadcn/drawer';
import { menuItemsObj } from '@/constants/menu';
import { ESupportedLanguages, EUserRole } from 'shared-types';
import NavLink from './NavLink';
import { EDevice } from '@/enums/shared';
import Logo from '@/components/ui/Logo';
import Typography from '@/components/ui/Typography';
import LogoutButton from './LogoutButton';
import { useRef } from 'react';

export default function NavMobile() {
  const t = useTranslations();
  const { role } = useSelector(selectUserData);
  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeNavHandler = () => closeRef.current?.click();

  return (
    <div className="sm:hidden">
      <Drawer direction="right" autoFocus={true}>
        <DrawerTrigger className="flex items-center justify-center">
          <Menu size={24} className="animation-hover" />
        </DrawerTrigger>

        <DrawerContent className="before:rounded-r-none">
          <DrawerHeader className="items-center">
            <DrawerTitle className="mb-6 flex items-center justify-center gap-4">
              <Logo />

              <Typography variant="h3" as="span">
                {t('common.appTitle')}
              </Typography>
            </DrawerTitle>

            <DrawerDescription>
              <Typography variant="note-wide" className="px-3 tracking-widest">
                {t('sidebar.mainMenu')}
              </Typography>
            </DrawerDescription>
          </DrawerHeader>

          <nav className="flex flex-col gap-2" onClick={closeNavHandler}>
            {role &&
              menuItemsObj[role as EUserRole].map(item => (
                <NavLink
                  key={`${EDevice.MOBILE}-${item.id}`}
                  href={item.href}
                  title={t(item.translationKey)}
                  isCurrentPath={
                    item.path
                      ? item.path[currentLocale as ESupportedLanguages] === normalizedPath
                      : false
                  }
                  isDesktop={false}
                >
                  <item.icon size={18} strokeWidth={2.5} className="ml-1" />
                </NavLink>
              ))}
          </nav>

          <div className="mt-auto">
            <LogoutButton isDesktop={false} />
          </div>

          <DrawerClose ref={closeRef} />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
