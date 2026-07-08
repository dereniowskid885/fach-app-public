'use client';

import HeaderNotificationList from '@/components/ui/HeaderNotificationList';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ESupportedLanguages } from 'shared-types';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/utils/pathname';
import SearchComponent from '@/components/ui/SearchComponent';
import { ESearchComponentVariant } from '@/enums/ui';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import Logo from './Logo';
import NavMobile from '../features/nav/NavMobile';
import AnimateCollapse from './AnimateCollapse';
import { useEffect, useState } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useGetNotificationsCountQuery } from '@/services/api/generated/accountApi';

export default function Header() {
  const { sidebarWidth } = useSidebarContext();

  const { data, error: errorGetNotifications } = useGetNotificationsCountQuery();
  const notificationsLength = data?.count ?? 0;

  useErrorHandler(errorGetNotifications);

  const [isDotIconShown, setIsDotIconShown] = useState(false);

  const hideDotIconHandler = (open: boolean) => {
    if (!open) return;

    setIsDotIconShown(false);
  };

  useEffect(() => {
    setIsDotIconShown(notificationsLength > 0);
  }, [notificationsLength]);

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  return (
    <motion.header
      initial={false}
      animate={{
        '--sidebar-offset': `${sidebarWidth}px`,
        '--header-width': `calc(100vw - ${sidebarWidth}px)`
      }}
      className={`bg-sidebar animate-margin-left animate-width fixed z-50 flex h-22 p-4 shadow-sm sm:p-8`}
    >
      <div className="flex w-full items-center justify-between gap-8">
        <div className="sm:hidden">
          <Logo />
        </div>

        {/* TODO to be improved - header search component */}
        <SearchComponent
          inputValue=""
          inputOnChangeHandler={() => null}
          variant={ESearchComponentVariant.HEADER}
          inputClassName="ring-1 ring-border"
        />

        <div className="flex items-center gap-3">
          <Popover onOpenChange={hideDotIconHandler}>
            <PopoverTrigger className="animation-hover h-10 w-10 rounded-2xl px-2">
              <div className="relative">
                <Bell size={24} />

                <AnimateCollapse isHidden={!isDotIconShown}>
                  <div className="bg-chart-3 absolute top-0 -right-1 h-2 w-2 rounded-full"></div>
                </AnimateCollapse>
              </div>
            </PopoverTrigger>

            <PopoverContent align="end" className="px-0 pt-2 pb-2">
              <HeaderNotificationList />
            </PopoverContent>
          </Popover>

          <NavMobile />

          <div className="hidden items-center gap-3 sm:flex">
            <LanguageSwitcher
              currentPath={normalizedPath}
              currentLang={currentLocale as ESupportedLanguages}
            />

            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
