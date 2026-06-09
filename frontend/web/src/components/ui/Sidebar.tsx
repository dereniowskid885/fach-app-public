import { useTranslations } from 'next-intl';
import { UserRole } from '@/services/api/generated/accountApi';
import { Button } from '@/components/shadcn/button';
import Typography from '@/components/ui/Typography';
import { useSelector } from 'react-redux';
import { selectUserData } from '@/redux/slices/UserDataSlice';
import Logo from '@/components/ui/Logo';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';
import AnimateCollapse from '@/components/ui/AnimateCollapse';
import { useSidebarContext } from '@/contexts/SidebarContext';
import UserCard from '@/components/features/user/UserCard';
import { Separator } from '@/components/shadcn/separator';
import NavDesktop from '../features/nav/NavDesktop';
import LogoutButton from '../features/nav/LogoutButton';

export default function Sidebar() {
  const t = useTranslations();
  const { sidebarWidth, isSidebarCollapsed, toggleSidebar } = useSidebarContext();
  const { role, name, surname, city, categoryName } = useSelector(selectUserData);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarWidth
      }}
      className={`bg-sidebar fixed hidden h-screen flex-col shadow-sm sm:flex w-[${sidebarWidth}px] z-50`}
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
            <Typography variant="note-wide" className="text-muted-foreground px-3 tracking-widest">
              {t('sidebar.mainMenu')}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      <NavDesktop isSidebarCollapsed={isSidebarCollapsed} />

      <Separator className="bg-border mt-2" />

      <div className="p-3">
        <Button
          variant="ghost"
          className="animation-hover h-9 w-full items-center justify-start gap-2.5 px-2"
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
            role: role as UserRole,
            city,
            category: {
              name: categoryName
            }
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          userNameTextWrap={true}
        />

        <LogoutButton isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </motion.aside>
  );
}
