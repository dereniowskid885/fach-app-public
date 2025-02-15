'use client';

import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import AccountVerifyDialog from '@/components/ui/AccountVerifyDialog';
import DialogComponent from '@/components/ui/DialogComponent';
import CitySelect from '@/components/ui/CitySelect';
import PasswordInput from '@/components/ui/PasswordInput';
import { Typography } from '@/components/ui/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { IRegisterForm, registerHandler } from '@/lib/auth';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IRegisterForm>();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [accountVerifyDialog, setAccountVerifyDialog] = useState<boolean>(false);

  const submitHandler = async (formData: IRegisterForm) => {
    if (formData.password !== formData.passwordConfirm) {
      setError('root', { message: 'Hasła muszą być takie same' });
      return;
    }

    if (!formData.city) {
      setError('root', { type: 'required', message: 'Miasto jest wymagane.' });
      return;
    }

    setLoading(true);
    const result = await registerHandler(formData);

    if (result.success) {
      setSuccessDialog(true);
    } else if (result.status === 207) {
      setAccountVerifyDialog(true);
    } else {
      setError('root', { message: result.error });
    }

    setLoading(false);
  };

  return (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4 text-center">
        <CardTitle>
          <Typography variant="h3" className="font-normal text-white">
            Stwórz swoje konto
          </Typography>
        </CardTitle>
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
                maxLength={48}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Imię</Label>
              <Input
                {...register('name')}
                id="name"
                placeholder="Jan"
                minLength={2}
                maxLength={20}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="surname">Nazwisko</Label>
              <Input
                {...register('surname')}
                id="surname"
                placeholder="Kowalski"
                minLength={3}
                maxLength={25}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <PasswordInput register={register('password')} id="password" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
              <PasswordInput register={register('passwordConfirm')} id="passwordConfirm" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="city">Miasto</Label>
              <CitySelect register={register('city')} id="city" />
            </div>
            {formState.errors.root && (
              <Typography variant="p" className="text-center font-bold text-error">
                {formState.errors.root.message}
              </Typography>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button loading={isLoading} type="submit">
            Potwierdź
          </Button>
          <Link href={LOGIN_PATH}>
            <Button variant="outline">Wróć</Button>
          </Link>
        </CardFooter>
      </form>
      <DialogComponent
        open={successDialog}
        title="Konto utworzone"
        description={`Link do weryfikacji konta został wysłany na e-mail: ${getValues('email')}`}
        cancelButtonText="Zamknij"
        confirmButtonText="Przejdź do logowania"
        cancelButtonHandler={() => setSuccessDialog(false)}
        confirmButtonHandler={() => router.push(LOGIN_PATH)}
      />
      <AccountVerifyDialog
        open={accountVerifyDialog}
        email={getValues('email')}
        title="Konto utworzone"
        description={`Wystąpił problem podczas wysyłania linku aktywacyjnego. Czy chcesz wysłać link ponownie na e-mail: ${getValues('email')}?`}
        emailSentDescription="Link do aktywacji konta został wysłany!"
        closeDialogHandler={() => setAccountVerifyDialog(false)}
      />
    </Card>
  );
}
