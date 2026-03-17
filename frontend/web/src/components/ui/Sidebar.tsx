import { LogOut } from 'lucide-react';
import NavLink from './NavLink';
import { LOGIN_PATH } from '@/constants/routes';
import { useLocale, useTranslations } from 'next-intl';
import LoadingOverlay from '../common/LoadingOverlay';
import { usePostAuthLogoutMutation, UserRole } from '@/api/accountApi';
import { Button } from '../shadcn/button';
import Typography from '../common/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { menuItemsObj } from '@/constants/menu';
import LanguageSwitcher from './LanguageSwitcher';
import { ESupportedLanguages, EUserRole } from '@shared/constants/enums';
import Logo from './Logo';
import { Skeleton } from '../shadcn/skeleton';
import ThemeSwitcher from './ThemeSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import AnimateCollapse from '../common/AnimateCollapse';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/lib/pathnameUtils';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { EPopoverContentDirection } from '@/constants/enums';
import UserCard from './UserCard';

export default function Sidebar() {
  const t = useTranslations();
  const { sidebarWidth, isSidebarCollapsed, toggleSidebar } = useSidebarContext();

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  const router = useRouter();
  const { role, name, surname } = useSelector(selectUserData);

  const [triggerLogout, { isLoading, error }] = usePostAuthLogoutMutation();

  useErrorHandler(error);

  const handleLogout = async () => {
    const { error } = await triggerLogout();
    if (error) return;

    router.push(LOGIN_PATH);
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarWidth
      }}
      className={`fixed flex h-screen flex-col border-r bg-sidebar shadow-md w-[${sidebarWidth}px] no-scrollbar z-50 overflow-auto`}
    >
      <motion.div
        animate={{
          paddingInline: isSidebarCollapsed ? '12px' : '28px',
          paddingBlock: isSidebarCollapsed ? '20px' : '24px'
        }}
        className="flex items-center gap-3 p-6 px-7"
      >
        <Logo />

        <AnimateCollapse isHidden={isSidebarCollapsed}>
          <Typography variant="h3">{t('common.appTitle')}</Typography>
        </AnimateCollapse>
      </motion.div>

      <AnimatePresence initial={false}>
        {isSidebarCollapsed ? null : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '24px' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center"
          >
            <Typography variant="note-wide" className="px-3 tracking-widest">
              {t('sidebar.mainMenu')}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex-1 space-y-2 p-3">
        {role
          ? menuItemsObj[role as EUserRole].map(item => (
              <NavLink
                key={item.id}
                href={item.href}
                isCurrentPath={
                  item.path
                    ? item.path[currentLocale as ESupportedLanguages] === normalizedPath
                    : false
                }
                isSidebarCollapsed={isSidebarCollapsed}
                title={t(item.translationKey)}
              >
                <item.icon size={18} strokeWidth={2.5} className="ml-1 shrink-0" />
              </NavLink>
            ))
          : Array.from({ length: 4 }).map((item, index) => (
              <Skeleton key={`menu-item-skeleton-${item}-${index}`} className="h-[36px]" />
            ))}
      </nav>

      <div className="p-3">
        <Button
          variant="ghost"
          className="animation-base animation-idle animation-interactive h-9 w-full items-center justify-start gap-2.5 px-2"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ArrowRightFromLine size={18} strokeWidth={2.5} className="ml-2" />
          ) : (
            <ArrowLeftFromLine size={18} strokeWidth={2.5} className="ml-2" />
          )}

          <AnimateCollapse isHidden={isSidebarCollapsed}>
            <Typography variant="small">{t('common.collapse')}</Typography>
          </AnimateCollapse>
        </Button>
      </div>

      <div className="space-y-3 border-t p-3">
        <UserCard
          user={{
            name,
            surname,
            role: role as UserRole
          }}
          showBackground={true}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <LanguageSwitcher
          currentPath={normalizedPath}
          currentLang={currentLocale as ESupportedLanguages}
          popoverContentDirection={EPopoverContentDirection.RIGHT}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <ThemeSwitcher isSidebarCollapsed={isSidebarCollapsed} />

        <Button
          className="animation-base animation-idle animation-interactive h-9 w-full justify-start gap-2.5 px-2 hover:text-destructive"
          onClick={handleLogout}
          variant="ghost"
        >
          <LogOut size={18} strokeWidth={2.5} className="ml-2" />

          <AnimateCollapse isHidden={isSidebarCollapsed}>
            <Typography variant="small">{t('common.logout')}</Typography>
          </AnimateCollapse>
        </Button>
      </div>

      <LoadingOverlay isLoading={isLoading} />
    </motion.aside>
  );
}
