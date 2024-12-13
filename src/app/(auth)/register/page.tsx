'use client';

import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import AlertDialog from '@/components/ui/AlertDialog';
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
  const { register, handleSubmit, formState, setError } = useForm<IRegisterForm>();

  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);

  const submitHandler = async (formData: IRegisterForm) => {
    if (formData.password !== formData.passwordConfirm) {
      setError('root', { message: 'Hasła muszą być takie same' });
      return;
    }

    const result = await registerHandler(formData);

    if (result.success) {
      setSuccessDialogOpen(true);
    } else {
      setError('root', { message: result.error });
    }
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
              <Label htmlFor="email">Email</Label>
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
              <Input
                {...register('password')}
                id="password"
                type="password"
                placeholder="*******"
                minLength={7}
                maxLength={64}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
              <Input
                {...register('passwordConfirm')}
                id="passwordConfirm"
                type="password"
                placeholder="*******"
                minLength={7}
                maxLength={64}
                required
              />
            </div>
            {formState.errors.root && (
              <Typography variant="p" className="text-center font-bold text-error">
                {formState.errors.root.message}
              </Typography>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">Potwierdź</Button>
          <Link href={LOGIN_PATH}>
            <Button variant="outline">Anuluj</Button>
          </Link>
        </CardFooter>
      </form>
      <AlertDialog
        open={successDialogOpen}
        title="Konto utworzone"
        cancelButtonText="Zamknij"
        confirmButtonText="Przejdź do logowania"
        cancelButtonHandler={() => setSuccessDialogOpen(false)}
        confirmButtonHandler={() => router.push(LOGIN_PATH)}
      />
    </Card>
  );
}
