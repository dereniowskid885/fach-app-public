'use client';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import DialogComponent from '@/components/common/DialogComponent';
import CitySelect from '@/components/ui/CitySelect';
import PasswordInput from '@/components/common/PasswordInput';
import Typography from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { Label } from '@/components/shadcn/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PostAuthRegisterApiArg,
  usePostAuthRegisterMutation
} from '@/services/api/generated/accountApi';
import AuthCard from '@/components/ui/AuthCard';
import { useLocale, useTranslations } from 'next-intl';
import { ESupportedLanguages } from '@shared/enums/language';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface IRegisterForm {
  email: string;
  name: string;
  surname: string;
  password: string;
  passwordConfirm: string;
  city: string;
}

export default function Register() {
  const t = useTranslations();
  const router = useRouter();
  const currentLocale = useLocale();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IRegisterForm>();
  const [successDialog, setSuccessDialog] = useState<boolean>(false);

  const [triggerRegister, { isLoading, error }] = usePostAuthRegisterMutation();

  useErrorHandler(error, {
    setInlineError: message => setError('root', { message })
  });

  const submitHandler = async (formData: IRegisterForm) => {
    if (formData.password !== formData.passwordConfirm) {
      setError('root', { message: t('errorMessages.passwordMatch') });
      return;
    }

    if (!formData.city) {
      setError('root', { type: 'required', message: t('errorMessages.cityRequired') });
      return;
    }

    const payload: PostAuthRegisterApiArg = {
      body: {
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        password: formData.password,
        city: formData.city,
        lang: currentLocale as ESupportedLanguages
      }
    };

    const { error } = await triggerRegister(payload);
    if (error) return;

    setSuccessDialog(true);
  };

  return (
    <AuthCard
      formSubmitHandler={handleSubmit(submitHandler)}
      titleContent={t('registerPage.authCardTitle')}
      mainContent={
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

          <div className="space-y-2">
            <Label htmlFor="name">{t('authForm.name')}</Label>
            <Input
              {...register('name')}
              id="name"
              placeholder={t('authForm.namePlaceholder')}
              minLength={2}
              maxLength={20}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname">{t('authForm.surname')}</Label>
            <Input
              {...register('surname')}
              id="surname"
              placeholder={t('authForm.surnamePlaceholder')}
              minLength={3}
              maxLength={25}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('authForm.password')}</Label>
            <PasswordInput register={register('password')} id="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">{t('authForm.passwordConfirm')}</Label>
            <PasswordInput register={register('passwordConfirm')} id="passwordConfirm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">{t('authForm.city')}</Label>
            <CitySelect register={register('city')} id="city" />
          </div>

          {formState.errors.root && (
            <Typography variant="p" className="mt-2 text-center font-bold text-destructive">
              {formState.errors.root.message}
            </Typography>
          )}
        </>
      }
      footerContent={
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
      }
      bottomContent={
        <>
          <DialogComponent
            open={successDialog}
            title={t('registerPage.successDialogTitle')}
            description={t.rich('registerPage.successDialogDescription', {
              email: getValues('email'),
              span: chunks => <span className="font-bold text-chart-2">{chunks}</span>
            })}
            cancelButtonText={t('common.close')}
            confirmButtonText={t('common.goToLogin')}
            cancelButtonHandler={() => setSuccessDialog(false)}
            confirmButtonHandler={() => router.push(LOGIN_PATH)}
          />
        </>
      }
    />
  );
}
