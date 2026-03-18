'use client';

import {
  PostAuthRequestPasswordResetApiArg,
  usePostAuthRequestPasswordResetMutation
} from '@/api/accountApi';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import Typography from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthCard from '@/components/ui/AuthCard';
import { useLocale, useTranslations } from 'next-intl';
import { ESupportedLanguages } from '@shared/enums/language';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface IPasswordResetRequestForm {
  email: string;
}

export default function PasswordResetRequest() {
  const t = useTranslations();
  const { register, handleSubmit, formState, setError, getValues } =
    useForm<IPasswordResetRequestForm>();
  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const currentLocale = useLocale();

  const [triggerRequest, { isLoading, error }] = usePostAuthRequestPasswordResetMutation();

  useErrorHandler(error, {
    setInlineError: message => setError('root', { message })
  });

  const submitHandler = async (formData: IPasswordResetRequestForm) => {
    const payload: PostAuthRequestPasswordResetApiArg = {
      body: {
        ...formData,
        lang: currentLocale as ESupportedLanguages
      }
    };

    const { error } = await triggerRequest(payload);
    if (error) return;

    setEmailSent(true);
  };

  return (
    <AuthCard
      formSubmitHandler={isEmailSent ? undefined : handleSubmit(submitHandler)}
      titleContent={isEmailSent ? null : t('passwordResetPage.authCardTitle')}
      descriptionContent={
        isEmailSent
          ? t.rich('passwordReset.authCardDescriptionSuccess', {
              email: getValues('email'),
              span: chunks => <span className="font-bold text-chart-2">{chunks}</span>
            })
          : t('passwordReset.authCardDescription')
      }
      mainContent={
        isEmailSent ? null : (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">{t('authForm.email')}</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder={t('authForm.emailPlaceholder')}
                minLength={7}
                maxLength={48}
                required
              />
            </div>

            {formState.errors.root && (
              <Typography variant="p" className="mt-2 text-center font-bold text-destructive">
                {formState.errors.root.message}
              </Typography>
            )}
          </>
        )
      }
      footerContent={
        isEmailSent ? (
          <Link href={LOGIN_PATH}>
            <Button>{t('common.backToLogin')}</Button>
          </Link>
        ) : (
          <div className="flex w-full gap-2">
            <Button loading={isLoading} type="submit" className="w-full">
              {t('common.confirm')}
            </Button>

            <Link href={LOGIN_PATH} className="w-full">
              <Button variant="outline" className="w-full">
                {t('common.back')}
              </Button>
            </Link>
          </div>
        )
      }
    />
  );
}
