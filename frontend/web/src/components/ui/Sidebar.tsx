import { LogOut } from 'lucide-react';
import NavLink from './NavLink';
import { LOGIN_PATH } from '@/constants/routes';
import { useLocale, useTranslations } from 'next-intl';
import LoadingOverlay from '../common/LoadingOverlay';
import { usePostAuthLogoutMutation } from '@/api/accountApi';
import { Button } from '../shadcn/button';
import { Typography } from '../common/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import { menuItems } from '@/constants/menu';
import LanguageSwitcher from './LanguageSwitcher';
import { ESupportedLanguages } from '@shared/constants/enums';
import Logo from './Logo';
import { Skeleton } from '../shadcn/skeleton';
import ThemeSwitcher from './ThemeSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import AnimateCollapse from '../common/AnimateCollapse';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { normalizePathname } from '@/lib/pathnameUtils';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function Sidebar() {
  const t = useTranslations();
  const { sidebarWidth, isSidebarCollapsed, toggleSidebar } = useSidebarContext();

  const currentPath = usePathname();
  const currentLocale = useLocale();
  const normalizedPath = normalizePathname(currentPath, currentLocale);

  const router = useRouter();
  const { role, fullName, name, surname } = useSelector(selectUserData);

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
            <Typography
              variant="note"
              className="px-3 font-bold uppercase tracking-widest text-muted-foreground"
            >
              {t('sidebar.mainMenu')}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="flex-1 space-y-2 p-3">
        {menuItems.map(item => (
          <NavLink
            key={item.id}
            href={item.href}
            isCurrentPath={
              item.path ? item.path[currentLocale as ESupportedLanguages] === normalizedPath : false
            }
            isSidebarCollapsed={isSidebarCollapsed}
            title={t(`pages.${item.id}`)}
          >
            <item.icon size={18} strokeWidth={2.5} className="ml-1" />
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <Button
          variant="ghost"
          className="animation-base animation-idle animation-interactive h-9 w-full justify-start gap-2.5 px-2"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ArrowRightFromLine size={18} strokeWidth={2.5} className="ml-2" />
          ) : (
            <ArrowLeftFromLine size={18} strokeWidth={2.5} className="ml-2" />
          )}

          <AnimateCollapse isHidden={isSidebarCollapsed}>
            <Typography variant="small" className="font-bold">
              {t('common.collapse')}
            </Typography>
          </AnimateCollapse>
        </Button>
      </div>

      <div className="space-y-3 border-t p-3 shadow-md">
        <div className="flex items-center gap-3 rounded-xl bg-background p-3">
          {name && surname ? (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border bg-card text-xs font-bold uppercase shadow-md">
              {`${name.charAt(0)}${surname.charAt(0)}`}
            </div>
          ) : (
            <Skeleton className="h-[32px] w-[32px] rounded-xl" />
          )}

          {isSidebarCollapsed ? null : (
            <div className="flex flex-col gap-1">
              {fullName ? (
                <Typography variant="note" className="line-clamp-1 font-bold">
                  {fullName}
                </Typography>
              ) : (
                <Skeleton className="h-[16px] w-[100px]" />
              )}

              {role ? (
                <Typography variant="note" className="text-xs capitalize text-muted-foreground">
                  {t(`userRole.${role}`)}
                </Typography>
              ) : (
                <Skeleton className="h-[16px] w-[100px]" />
              )}
            </div>
          )}
        </div>

        <LanguageSwitcher
          currentPath={normalizedPath}
          currentLang={currentLocale as ESupportedLanguages}
          popoverContentDirection="right"
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
            <Typography variant="small" className="font-bold">
              {t('common.logout')}
            </Typography>
          </AnimateCollapse>
        </Button>
      </div>

      <LoadingOverlay isLoading={isLoading} />
    </motion.aside>
  );
}
