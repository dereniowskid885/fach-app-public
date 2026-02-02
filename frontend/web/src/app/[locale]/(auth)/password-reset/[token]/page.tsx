'use client';

import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import PasswordInput from '@/components/common/PasswordInput';
import { Typography } from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { getLastPathSegment, parseQueryError } from '@/lib/helpers';
import { getTokenPayload, isTokenExpired } from '@/lib/token';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { notFound } from 'next/navigation';
import { PostAuthPasswordResetApiArg, usePostAuthPasswordResetMutation } from '@/api/accountApi';
import AuthCard from '@/components/ui/AuthCard';

interface IPasswordResetForm {
  newPassword: string;
  newPasswordConfirm: string;
  token: string;
}

export default function PasswordResetForm() {
  const { register, handleSubmit, formState, setError } = useForm<IPasswordResetForm>();
  const pathname = usePathname();

  const token = getLastPathSegment(pathname);
  const tokenExpired = isTokenExpired(token);
  const tokenPayload = getTokenPayload(token);

  const [isFormVisible, setFormVisible] = useState<boolean>(!tokenExpired);

  if (!tokenPayload) {
    notFound();
  }

  const [triggerPasswordReset, { isLoading }] = usePostAuthPasswordResetMutation();

  const submitHandler = async (formData: IPasswordResetForm) => {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('root', { message: 'Hasła muszą być takie same' });
      return;
    }

    const payload: PostAuthPasswordResetApiArg = {
      body: {
        newPassword: formData.newPassword,
        token
      }
    };

    const result = await triggerPasswordReset(payload);

    if (result.error) {
      const { message } = parseQueryError(result.error);

      setError('root', { message });
    } else {
      setFormVisible(false);
    }
  };

  return (
    <AuthCard
      formSubmitHandler={isFormVisible ? handleSubmit(submitHandler) : undefined}
      titleContent={
        isFormVisible
          ? 'Zresetuj hasło'
          : tokenExpired
            ? 'Link do resetu hasła wygasł'
            : 'Hasło zostało zresetowane!'
      }
      descriptionContent={isFormVisible ? 'Wypełnij dane' : null}
      mainContent={
        isFormVisible ? (
          <>
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="newPassword">Hasło</Label>
              <PasswordInput register={register('newPassword')} id="newPassword" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPasswordConfirm">Powtórz hasło</Label>
              <PasswordInput register={register('newPasswordConfirm')} id="newPasswordConfirm" />
            </div>

            {formState.errors.root && (
              <Typography variant="p" className="mt-2 text-center font-bold text-destructive">
                {formState.errors.root.message}
              </Typography>
            )}
          </>
        ) : null
      }
      footerContent={
        <div className="flex w-full gap-2">
          {isFormVisible ? (
            <Button loading={isLoading} type="submit" className="w-full">
              Potwierdź
            </Button>
          ) : null}

          <Link href={LOGIN_PATH} className="w-full">
            <Button variant="outline" className="w-full">
              Wróć do logowania
            </Button>
          </Link>
        </div>
      }
    />
  );
}
