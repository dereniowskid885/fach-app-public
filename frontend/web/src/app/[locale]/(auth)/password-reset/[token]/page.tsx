'use client';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import PasswordInput from '@/components/common/PasswordInput';
import { Typography } from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { parseQueryError } from '@/lib/utils';
import { getTokenPayload, isTokenExpired } from '@/lib/tokenUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notFound } from 'next/navigation';
import { PostAuthPasswordResetApiArg, usePostAuthPasswordResetMutation } from '@/api/accountApi';
import AuthCard from '@/components/ui/AuthCard';
import { useTranslations } from 'next-intl';
import { getLastPathSegment } from '@/lib/pathnameUtils';

interface IPasswordResetForm {
  newPassword: string;
  newPasswordConfirm: string;
  token: string;
}

export default function PasswordResetForm() {
  const t = useTranslations();
  const { register, handleSubmit, formState, setError } = useForm<IPasswordResetForm>();
  const pathname = usePathname();

  const token = getLastPathSegment(pathname);
  const tokenExpired = isTokenExpired(token);
  const tokenPayload = getTokenPayload(token);

  const [isFormVisible, setFormVisible] = useState<boolean>(!tokenExpired);

  if (!tokenPayload) {
    notFound();
  }

  const [triggerPasswordReset, { isLoading }] = usePostAuthPasswordResetMutation();

  const submitHandler = async (formData: IPasswordResetForm) => {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('root', { message: t('errorMessages.passwordMatch') });
      return;
    }

    const payload: PostAuthPasswordResetApiArg = {
      body: {
        newPassword: formData.newPassword,
        token
      }
    };

    const result = await triggerPasswordReset(payload);

    if (result.error) {
      const { message } = parseQueryError(result.error);

      setError('root', { message });
    } else {
      setFormVisible(false);
    }
  };

  return (
    <AuthCard
      formSubmitHandler={isFormVisible ? handleSubmit(submitHandler) : undefined}
      titleContent={
        isFormVisible
          ? t('passwordResetPage.authCardTitle')
          : tokenExpired
            ? t('passwordResetPage.linkExpired')
            : t('passwordResetPage.authCardTitleSuccess')
      }
      mainContent={
        isFormVisible ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">{t('authForm.email')}</Label>
              <Input
                id="email"
                type="email"
                value={tokenPayload.email ?? t('authForm.emailPlaceholder')}
                minLength={7}
                maxLength={48}
                readOnly
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t('authForm.password')}</Label>
              <PasswordInput register={register('newPassword')} id="newPassword" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPasswordConfirm">{t('authForm.passwordConfirm')}</Label>
              <PasswordInput register={register('newPasswordConfirm')} id="newPasswordConfirm" />
            </div>

            {formState.errors.root && (
              <Typography variant="p" className="mt-2 text-center font-bold text-destructive">
                {formState.errors.root.message}
              </Typography>
            )}
          </>
        ) : null
      }
      footerContent={
        <div className="flex w-full gap-2">
          {isFormVisible ? (
            <Button loading={isLoading} type="submit" className="w-full">
              {t('common.confirm')}
            </Button>
          ) : null}

          <Link href={LOGIN_PATH} className="w-full">
            <Button variant="outline" className="w-full">
              {t('common.backToLogin')}
            </Button>
          </Link>
        </div>
      }
    />
  );
}
