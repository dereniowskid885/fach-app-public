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
import PasswordInput from '@/components/ui/PasswordInput';
import { Typography } from '@/components/ui/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { IPasswordResetForm, passwordResetHandler } from '@/lib/auth';
import { getLastPathSegment } from '@/lib/helpers';
import { getTokenPayload, isTokenExpired } from '@/lib/token';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordResetForm() {
  const { register, handleSubmit, formState, setError } = useForm<IPasswordResetForm>();
  const pathname = usePathname();

  const token = getLastPathSegment(pathname);
  const tokenExpired = isTokenExpired(token);
  const tokenPayload = getTokenPayload(token);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFormVisible, setFormVisible] = useState<boolean>(!tokenExpired);

  const submitHandler = async (formData: IPasswordResetForm) => {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('root', { message: 'Hasła muszą być takie same' });
      return;
    }

    setLoading(true);
    const result = await passwordResetHandler({ ...formData, token });

    if (result.success) {
      setFormVisible(false);
    } else {
      setError('root', { message: result.error });
    }

    setLoading(false);
  };

  return (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      {isFormVisible ? (
        <>
          <CardHeader className="space-y-4">
            <CardTitle>
              <Typography variant="h3" className="text-center font-normal text-white">
                Zresetuj hasło
              </Typography>
            </CardTitle>
            <CardDescription>
              <Typography variant="p" className="text-info">
                Wprowadź nowe hasło
              </Typography>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(submitHandler)}>
            <CardContent>
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={tokenPayload.email ?? ''}
                    minLength={7}
                    maxLength={48}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newPassword">Hasło</Label>
                  <PasswordInput register={register('newPassword')} id="newPassword" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newPasswordConfirm">Powtórz hasło</Label>
                  <PasswordInput
                    register={register('newPasswordConfirm')}
                    id="newPasswordConfirm"
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
                <Button variant="outline">Wróć do logowania</Button>
              </Link>
            </CardFooter>
          </form>
        </>
      ) : (
        <>
          <CardHeader className="space-y-4">
            <CardTitle>
              <Typography variant="h3" className="text-center font-normal text-white">
                {tokenExpired ? 'Link do resetu hasła wygasł' : 'Hasło zostało zresetowane!'}
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href={LOGIN_PATH}>
              <Button>Wróć do logowania</Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
