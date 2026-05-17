import { notifications } from '@/mocks/notifications';
import AmountIcon from './AmountIcon';
import HeaderNotificationList from './HeaderNotificationList';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ESupportedLanguages } from 'shared-types';
import { Bell, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Button } from '../shadcn/button';
import { Separator } from '../shadcn/separator';
import { motion } from 'framer-motion';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/utils/pathname';
import SearchComponent from '../common/SearchComponent';
import { ESearchComponentVariant } from '@/enums/ui';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const { sidebarWidth } = useSidebarContext();

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

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
        {/* TODO to be improved - header search component */}
        <SearchComponent
          inputValue=""
          inputOnChangeHandler={() => null}
          variant={ESearchComponentVariant.BIG}
          inputClassName="ring-1 ring-border"
        />

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger className="animation-base animation-idle animation-interactive h-10 w-10 rounded-2xl px-2">
              <AmountIcon amount={notifications.length}>
                <Bell size={24} />
              </AmountIcon>
            </PopoverTrigger>

            <PopoverContent align="end">
              <HeaderNotificationList />
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="mx-2 h-[20px]" />

          <LanguageSwitcher
            currentPath={normalizedPath}
            currentLang={currentLocale as ESupportedLanguages}
          />

          <ThemeSwitcher />

          <Button
            variant="ghost"
            size="icon"
            className="animation-base animation-idle animation-interactive h-10 w-10 rounded-2xl"
          >
            <HelpCircle size={24} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
