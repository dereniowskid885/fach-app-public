import { notifications } from '@/mocks/notifications';
import AmountIcon from './AmountIcon';
import HeaderNotificationList from './HeaderNotificationList';
import { Typography } from '../common/Typography';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { menuItems } from '@/constants/menu';
import { ESupportedLanguages } from '@shared/constants/enums';
import { Bell, HelpCircle, Search, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Input } from '../shadcn/input';
import { Button } from '../shadcn/button';
import { Separator } from '../shadcn/separator';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/lib/pathnameUtils';

export default function Header() {
  const t = useTranslations();
  const { sidebarWidth } = useSidebarContext();

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  const pageData = menuItems.find(item =>
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
        {pageData ? (
          <div className="flex w-1/2 items-center gap-3">
            <div className="rounded-sm bg-foreground p-1 shadow-md">
              <pageData.icon size={26} className="text-background" />
            </div>

            <Typography variant="large">{t(`pages.${pageData?.id}`)}</Typography>
          </div>
        ) : null}

        <div className="relative flex w-1/2 items-center justify-end gap-3">
          <div className="absolute left-0 -translate-x-1/2">
            <div className="group relative w-32 lg:w-64 xl:w-[600px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                size={24}
              />

              <Input
                placeholder={t('common.search')}
                className="h-11 rounded-xl bg-background pl-11 transition-all focus-visible:bg-background focus-visible:ring-2 dark:bg-secondary"
              />
            </div>
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

            <Separator orientation="vertical" className="mx-2 h-[20px] bg-border" />

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
