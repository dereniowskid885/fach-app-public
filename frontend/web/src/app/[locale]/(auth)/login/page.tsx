'use client';

import { PostAuthLoginApiArg, usePostAuthLoginMutation } from '@/services/api/generated/accountApi';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import AccountVerifyDialog from '@/app/[locale]/(auth)/_components/AccountVerifyDialog';
import PasswordInput from '@/components/ui/PasswordInput';
import Typography from '@/components/ui/Typography';
import { HOME_PATH, PASSWORD_RESET_PATH, REGISTER_PATH } from '@/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import AuthCard from '../_components/AuthCard';
import { EResponseStatus } from 'shared-types';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { clearUserData } from '@/redux/slices/UserDataSlice';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { parseQueryError } from '@/utils/error';
import { isCookie } from '@/utils/cookie';
import { Spinner } from '@/components/shadcn/spinner';

interface ILoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, setError, getValues } = useForm<ILoginForm>();
  const [accountVerifyDialog, setAccountVerifyDialog] = useState<boolean>(false);

  const [triggerLogin, { isLoading, error }] = usePostAuthLoginMutation();

  useErrorHandler(error, {
    callback: () => {
      const { status } = parseQueryError(error!);

      if (status === EResponseStatus.ERROR_USER_NOT_VERIFIED) {
        setAccountVerifyDialog(true);
      }
    },
    setInlineError: message => setError('root', { message })
  });

  const submitHandler = async (formData: ILoginForm) => {
    const payload: PostAuthLoginApiArg = {
      body: {
        ...formData
      }
    };

    const { error } = await triggerLogin(payload);
    if (error) return;

    router.push(HOME_PATH);
  };

  useEffect(() => {
    dispatch(clearUserData());

    const checkUserSession = async () => {
      const hasRefreshToken = await isCookie('refreshToken');

      if (hasRefreshToken) {
        router.push(HOME_PATH);
      }
    };

    checkUserSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthCard
      formSubmitHandler={handleSubmit(submitHandler)}
      titleContent={t('authForm.signIn')}
      descriptionContent={t.rich('loginPage.authCardDescription', {
        span: chunks => <span className="text-foreground font-bold">{chunks}</span>
      })}
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

          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <Label htmlFor="password">{t('authForm.password')}</Label>
              <PasswordInput register={register('password')} id="password" />
            </div>

            <Link href={PASSWORD_RESET_PATH} className="ml-auto w-fit">
              <Typography variant="small" className="text-info hover:underline">
                {t('loginPage.forgotPassword')}
              </Typography>
            </Link>
          </div>

          {formState.errors.root && (
            <Typography variant="p" className="text-destructive text-center font-bold">
              {formState.errors.root.message}
            </Typography>
          )}
        </>
      }
      footerContent={
        <>
          <Button type="submit" className="w-full">
            {isLoading ? <Spinner /> : null}

            {t('authForm.signIn')}
          </Button>

          <p className="text-muted-foreground text-sm">
            {t('loginPage.signUpLabel')}

            <Link href={REGISTER_PATH} className="text-foreground ml-1 font-bold hover:underline">
              {t('authForm.signUp')}
            </Link>
          </p>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="border-muted-foreground/20 w-full border-t"></div>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary text-muted-foreground px-2">
                {t('loginPage.continueWith')}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="outline" className="w-1/2 gap-2">
              <FaGithub />

              {t('loginPage.github')}
            </Button>

            <Button variant="outline" className="w-1/2 gap-2">
              <FcGoogle />

              {t('loginPage.google')}
            </Button>
          </div>
        </>
      }
      bottomContent={
        <AccountVerifyDialog
          open={accountVerifyDialog}
          email={getValues('email')}
          title={t('loginPage.accountVerifyTitle')}
          description={t.rich('loginPage.accountVerifyDescription', {
            email: getValues('email'),
            span: chunks => <span className="text-foreground font-bold">{chunks}</span>
          })}
          emailSentDescription={t('loginPage.accountVerifyEmailSent')}
          closeDialogHandler={() => setAccountVerifyDialog(false)}
        />
      }
    />
  );
}
