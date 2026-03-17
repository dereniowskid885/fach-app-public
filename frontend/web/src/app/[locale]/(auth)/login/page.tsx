'use client';

import { PostAuthLoginApiArg, usePostAuthLoginMutation } from '@/api/accountApi';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import AccountVerifyDialog from '@/components/ui/AccountVerifyDialog';
import PasswordInput from '@/components/common/PasswordInput';
import Typography from '@/components/common/Typography';
import { HOME_PATH, PASSWORD_RESET_PATH, REGISTER_PATH } from '@/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isCookie } from '@/helpers/isCookie';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import AuthCard from '@/components/ui/AuthCard';
import { EResponseStatus } from '@shared/constants/responseStatus';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { clearUserData } from '@/redux/slices/UserDataSlice';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { parseQueryError } from '@/lib/errorUtils';

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
        span: chunks => <span className="font-bold text-chart-2">{chunks}</span>
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
            <Typography variant="p" className="text-center font-bold text-destructive">
              {formState.errors.root.message}
            </Typography>
          )}
        </>
      }
      footerContent={
        <>
          <Button loading={isLoading} type="submit" className="w-full">
            {t('authForm.signIn')}
          </Button>

          <p className="text-sm text-muted-foreground">
            {t('loginPage.signUpLabel')}

            <Link href={REGISTER_PATH} className="ml-1 font-bold text-primary hover:underline">
              {t('authForm.signUp')}
            </Link>
          </p>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="border-muted-foreground/20 w-full border-t"></div>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary px-2 text-muted-foreground">
                {t('loginPage.continueWith')}
              </span>
            </div>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="outline" className="w-full gap-2">
              <FaGithub />

              {t('loginPage.github')}
            </Button>

            <Button variant="outline" className="w-full gap-2">
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
            span: chunks => <span className="font-bold text-chart-2">{chunks}</span>
          })}
          emailSentDescription={t('loginPage.accountVerifyEmailSent')}
          closeDialogHandler={() => setAccountVerifyDialog(false)}
        />
      }
    />
  );
}
