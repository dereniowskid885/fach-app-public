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
import { Typography } from '@/components/ui/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { IPasswordResetRequestForm, passwordResetRequestHandler } from '@/lib/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordResetRequest() {
  const { register, handleSubmit, formState, setError, getValues } =
    useForm<IPasswordResetRequestForm>();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEmailSent, setEmailSent] = useState<boolean>(false);

  const submitHandler = async (formData: IPasswordResetRequestForm) => {
    setLoading(true);
    const result = await passwordResetRequestHandler(formData);

    if (result.success) {
      setEmailSent(true);
    } else {
      setError('root', { message: result.error });
    }

    setLoading(false);
  };

  return (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4">
        <CardTitle>
          <Typography variant="h3" className="text-center font-normal text-white">
            Zresetuj hasło
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography variant="p" className="text-info">
            {isEmailSent ? (
              <>
                {'Link do zresetowania hasła został wysłany na e-mail: '}
                <span className="font-bold text-white">{getValues('email')}</span>
              </>
            ) : (
              'Wprowadź swój e-mail, aby uzyskać link do zresetowania hasła.'
            )}
          </Typography>
        </CardDescription>
      </CardHeader>
      {isEmailSent ? (
        <CardFooter className="justify-center">
          <Link href={LOGIN_PATH}>
            <Button>Wróć do logowania</Button>
          </Link>
        </CardFooter>
      ) : (
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
      )}
    </Card>
  );
}
