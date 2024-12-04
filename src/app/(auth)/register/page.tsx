'use client';

import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Typography } from '@/components/ui/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { IRegisterForm, registerHandler } from '@/lib/auth';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm<IRegisterForm>();

  const submitHandler = async (formData: IRegisterForm) => {
    const result = await registerHandler(formData);

    if (result.success) {
      router.push(LOGIN_PATH);
    } else {
      setError('root', { message: result.error });
    }
  };

  return (
    <Card className="w-screen min-w-[400px] rounded-none border-none bg-primary-800 sm:w-auto">
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
              <Input {...register('email')} id="email" placeholder="jankowalski@gmail.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Imię</Label>
              <Input {...register('name')} id="name" placeholder="Jan" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="surname">Nazwisko</Label>
              <Input {...register('surname')} id="surname" placeholder="Kowalski" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Hasło</Label>
              <Input {...register('password')} id="password" type="password" placeholder="******" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
              <Input
                {...register('passwordConfirm')}
                id="passwordConfirm"
                type="password"
                placeholder="******"
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
    </Card>
  );
}
