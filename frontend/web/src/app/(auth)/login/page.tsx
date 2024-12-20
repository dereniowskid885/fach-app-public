'use client';

import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import AlertDialog from '@/components/ui/AlertDialog';
import PasswordInput from '@/components/ui/PasswordInput';
import { Typography } from '@/components/ui/Typography';
import { HOME_PATH, PASSWORD_RESET_PATH, REGISTER_PATH } from '@/constants/routes';
import { accountVerifyRequestHandler, ILoginForm, loginHandler } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError, getValues } = useForm<ILoginForm>();
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const [isAccountVerifyLoading, setAccountVerifyLoading] = useState<boolean>(false);
  const [accountVerifyDialog, setAccountVerifyDialog] = useState<boolean>(false);
  const [accountVerifyError, setAccountVerifyError] = useState<string>('');

  const submitHandler = async (formData: ILoginForm) => {
    setSubmitLoading(true);
    const result = await loginHandler(formData);

    if (result.success) {
      router.push(HOME_PATH);
    } else if (result.status === 403) {
      openAccountVerifyDialog();
    } else {
      setError('root', { message: result.error });
    }

    setSubmitLoading(false);
  };

  const accountVerifyRequest = async () => {
    setAccountVerifyLoading(true);
    const result = await accountVerifyRequestHandler({ email: getValues('email') });

    if (result.success) {
      setEmailSent(true);
    } else {
      setAccountVerifyError(result.error ?? '');
    }

    setAccountVerifyLoading(false);
  };

  const openAccountVerifyDialog = () => {
    setEmailSent(false);
    setAccountVerifyError('');
    setAccountVerifyDialog(true);
  };

  return (
    <Card className="w-screen min-w-[300px] rounded-none border-none bg-primary-800 sm:w-auto">
      <CardHeader className="space-y-4 text-center lg:p-8">
        <CardTitle>
          <Typography variant="h1" className="italic">
            Issue solver
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="h3" className="font-normal text-white">
            Zaloguj się na swoje konto
          </Typography>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(submitHandler)}>
        <CardContent>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="jankowalski@gmail.com"
                minLength={7}
                maxLength={32}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <PasswordInput register={register('password')} id="password" />
              <Link href={PASSWORD_RESET_PATH}>
                <Typography variant="small" className="block text-right text-info hover:underline">
                  Zapomniałeś hasła ?
                </Typography>
              </Link>
            </div>
            {formState.errors.root && (
              <Typography variant="p" className="text-center font-bold text-error">
                {formState.errors.root.message}
              </Typography>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button loading={isSubmitLoading} type="submit">
            Zaloguj
          </Button>
          <Link href={REGISTER_PATH}>
            <Button variant="outline">Rejestracja</Button>
          </Link>
        </CardFooter>
      </form>
      <AlertDialog
        open={accountVerifyDialog}
        title="Konto nieaktywne"
        description={
          isEmailSent
            ? 'Link do aktywacji konta został wysłany!'
            : `Czy chcesz otrzymać link aktywacyjny na e-mail: ${getValues('email')}?`
        }
        cancelButtonText="Zamknij"
        confirmButtonText={isEmailSent ? '' : 'Wyślij link'}
        cancelButtonHandler={() => setAccountVerifyDialog(false)}
        confirmButtonHandler={isEmailSent ? undefined : accountVerifyRequest}
        errorMessage={accountVerifyError}
        isLoadingConfirmButton={isAccountVerifyLoading}
      />
    </Card>
  );
}
