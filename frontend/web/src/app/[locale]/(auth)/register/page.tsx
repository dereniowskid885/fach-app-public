'use client';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import AccountVerifyDialog from '@/components/ui/AccountVerifyDialog';
import DialogComponent from '@/components/common/DialogComponent';
import CitySelect from '@/components/ui/CitySelect';
import PasswordInput from '@/components/common/PasswordInput';
import { Typography } from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { Label } from '@/components/shadcn/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PostAuthRegisterApiArg, usePostAuthRegisterMutation } from '@/api/accountApi';
import { parseQueryError } from '@/lib/helpers';
import AuthCard from '@/components/ui/AuthCard';

interface IRegisterForm {
  email: string;
  name: string;
  surname: string;
  password: string;
  passwordConfirm: string;
  city: string;
}

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IRegisterForm>();
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [accountVerifyDialog, setAccountVerifyDialog] = useState<boolean>(false);

  const [triggerRegister, { isLoading }] = usePostAuthRegisterMutation();

  const submitHandler = async (formData: IRegisterForm) => {
    if (formData.password !== formData.passwordConfirm) {
      setError('root', { message: 'Hasła muszą być takie same' });
      return;
    }

    if (!formData.city) {
      setError('root', { type: 'required', message: 'Miasto jest wymagane.' });
      return;
    }

    const payload: PostAuthRegisterApiArg = {
      body: {
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        password: formData.password,
        city: formData.city
      }
    };

    const result = await triggerRegister(payload);
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      setSuccessDialog(true);
      return;
    }

    const { status, message } = parseQueryError(result.error);

    if (status === 207) {
      setAccountVerifyDialog(true);
    } else {
      setError('root', { message: message });
    }
  };

  return (
    <AuthCard
      formSubmitHandler={handleSubmit(submitHandler)}
      titleContent={'Stwórz swoje konto'}
      mainContent={
        <>
          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <PasswordInput register={register('password')} id="password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
            <PasswordInput register={register('passwordConfirm')} id="passwordConfirm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Miasto</Label>
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
            Potwierdź
          </Button>
          <Link href={LOGIN_PATH} className="w-full">
            <Button variant="outline" className="w-full">
              Wróć
            </Button>
          </Link>
        </div>
      }
      bottomContent={
        <>
          <DialogComponent
            open={successDialog}
            title="Konto utworzone"
            description={
              <>
                {'Link do weryfikacji konta został wysłany na e-mail: '}
                <span className="font-bold text-chart-2">{getValues('email')}</span>
              </>
            }
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
        </>
      }
    />
  );
}
