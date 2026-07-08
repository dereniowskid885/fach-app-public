import { Button } from '@/components/shadcn/button';
import AnimateCollapse from '@/components/ui/AnimateCollapse';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import Typography from '@/components/ui/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { cn } from '@/lib/utils';
import { usePostAuthLogoutMutation } from '@/services/api/generated/accountApi';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export interface ILogoutButton {
  isSidebarCollapsed?: boolean;
  isDesktop?: boolean;
}

export default function LogoutButton({ isSidebarCollapsed, isDesktop = true }: ILogoutButton) {
  const t = useTranslations();
  const router = useRouter();
  const [triggerLogout, { isLoading, error }] = usePostAuthLogoutMutation();

  useErrorHandler(error);

  const handleLogout = async () => {
    const { error } = await triggerLogout();
    if (error) return;

    router.push(LOGIN_PATH);
  };

  return (
    <>
      <Button
        className={cn(
          'animation-hover text-destructive h-9 w-full justify-start gap-2.5 px-2',
          isDesktop ? 'justify-start' : 'justify-end'
        )}
        onClick={handleLogout}
        variant="ghost"
      >
        <LogOut size={18} strokeWidth={2.5} className="ml-2" />

        <AnimateCollapse isHidden={!!isSidebarCollapsed}>
          <Typography variant={isDesktop ? 'small' : 'lead'}>{t('common.logout')}</Typography>
        </AnimateCollapse>
      </Button>

      <LoadingOverlay isLoading={isLoading} />
    </>
  );
}
