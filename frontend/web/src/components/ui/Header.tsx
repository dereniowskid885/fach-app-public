import { notifications } from '@/mocks/notifications';
import AmountIcon from './AmountIcon';
import HeaderNotificationList from './HeaderNotificationList';
import Typography from '../common/Typography';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { menuItemsObj } from '@/constants/menu';
import { ESupportedLanguages, EUserRole } from '@shared/constants/enums';
import { Bell, HelpCircle, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Button } from '../shadcn/button';
import { Separator } from '../shadcn/separator';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/lib/pathnameUtils';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { Skeleton } from '../shadcn/skeleton';
import SearchComponent from '../common/SearchComponent';
import { ESearchComponentVariant } from '@/constants/enums';

export default function Header() {
  const t = useTranslations();
  const { sidebarWidth } = useSidebarContext();
  const { role } = useSelector(selectUserData);

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  const pageData = menuItemsObj[role as EUserRole]?.find(item =>
    item.path ? item.path[currentLocale as ESupportedLanguages] === normalizedPath : false
  );

  return (
    <motion.header
      initial={false}
      animate={{
        left: sidebarWidth,
        width: `calc(100vw - ${sidebarWidth}px)`
      }}
      className={`fixed flex h-[88px] bg-sidebar p-8 shadow-md left-[${sidebarWidth}px] w-[calc(100vw-${sidebarWidth}px)] z-50`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-1/2 items-center gap-3">
          {pageData ? (
            <div className="rounded-sm bg-foreground p-1 shadow-md">
              <pageData.icon size={26} className="text-background" />
            </div>
          ) : (
            <Skeleton className="h-[34px] w-[34px]" />
          )}

          {pageData ? (
            <Typography variant="large">{t(pageData.translationKey)}</Typography>
          ) : (
            <Skeleton className="h-[28px] w-[100px]" />
          )}
        </div>

        <div className="relative flex w-1/2 items-center justify-end gap-3">
          <div className="absolute left-0 -translate-x-1/2">
            {/* TODO to be improved - header search component */}
            <SearchComponent
              inputValue=""
              inputOnChangeHandler={() => null}
              variant={ESearchComponentVariant.BIG}
              inputClassName="shadow-md ring-1 ring-border"
            />
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger className="animation-base animation-idle animation-interactive h-10 w-10 rounded-xl px-2">
                <AmountIcon amount={notifications.length}>
                  <Bell size={24} />
                </AmountIcon>
              </PopoverTrigger>

              <PopoverContent align="end">
                <HeaderNotificationList />
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="mx-2 h-[20px]" />

            <Button
              variant="ghost"
              size="icon"
              className="animation-base animation-idle animation-interactive h-10 w-10 rounded-xl"
            >
              <HelpCircle size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="animation-base animation-idle animation-interactive h-10 w-10 rounded-xl"
            >
              <Settings size={24} />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
