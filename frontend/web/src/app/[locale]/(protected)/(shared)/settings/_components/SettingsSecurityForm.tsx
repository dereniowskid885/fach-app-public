'use client';

import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import ContentCard from '@/components/ui/ContentCard';
import ContentSectionItem from '@/components/ui/ContentSectionItem';
import DialogComponent from '@/components/ui/DialogComponent';
import PasswordInput from '@/components/ui/PasswordInput';
import { LOGIN_PATH } from '@/constants/routes';
import { EErrorStrategy } from '@/enums/shared';
import { ESectionItemType } from '@/enums/ui';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { usePatchUsersChangePasswordMutation } from '@/services/api/generated/accountApi';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ISecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function SettingsSecurityForm() {
  const t = useTranslations();
  const router = useRouter();
  const { register, handleSubmit, getValues } = useForm<ISecurityForm>();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  const [
    triggerPasswordChange,
    { isLoading: isLoadingPasswordChange, error: errorPasswordChange }
  ] = usePatchUsersChangePasswordMutation();

  useErrorHandler(errorPasswordChange, {
    strategyOverride: EErrorStrategy.TOAST
  });

  const openConfirmDialog = () => {
    const { currentPassword, newPassword, confirmNewPassword } = getValues();

    if (currentPassword === newPassword) {
      toast.warning(t('passwordInput.passwordEqualsCurrent'));

      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.warning(t('passwordInput.newPasswordMatch'));

      return;
    }

    setConfirmDialogOpen(true);
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword } = getValues();

    const { error } = await triggerPasswordChange({
      body: {
        currentPassword,
        newPassword
      }
    });
    if (error) return;

    toast.success(t('settingsPage.securityForm.toastTitle'));
    router.push(LOGIN_PATH);
  };

  return (
    <ContentCard index={1} className="space-y-6 p-6 sm:p-8">
      <ContentSectionItem
        title={t('settingsPage.securityForm.title')}
        titleClass={'text-sm font-bold text-primary'}
        description={t('settingsPage.securityForm.description')}
        descriptionClass={'font-semibold text-muted-foreground'}
        variant={ESectionItemType.SETTINGS_SECURITY}
      />

      <form onSubmit={handleSubmit(openConfirmDialog)} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">{t('settingsPage.securityForm.currentPassword')}</Label>

          <PasswordInput register={register('currentPassword')} id="currentPassword" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">{t('settingsPage.securityForm.newPassword')}</Label>

          <PasswordInput
            register={register('newPassword')}
            id="newPassword"
            placeholder=""
            showPasswordInfo={true}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">
            {t('settingsPage.securityForm.confirmNewPassword')}
          </Label>

          <PasswordInput
            register={register('confirmNewPassword')}
            id="confirmNewPassword"
            placeholder=""
          />
        </div>

        <Button variant="special-1" type="submit" className="ml-auto mt-2">
          <Lock size={16} />

          {t('settingsPage.securityForm.submitButton')}
        </Button>
      </form>

      <DialogComponent
        open={confirmDialogOpen}
        title={t('settingsPage.securityForm.confirmDialogTitle')}
        description={t('settingsPage.securityForm.confirmDialogDescription')}
        cancelButtonText={t('common.close')}
        cancelButtonHandler={() => setConfirmDialogOpen(false)}
        confirmButtonText={t('common.confirm')}
        confirmButtonHandler={handlePasswordChange}
        isLoadingConfirmButton={isLoadingPasswordChange}
      />
    </ContentCard>
  );
}
