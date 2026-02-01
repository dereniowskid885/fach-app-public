'use client';

import {
  PostAuthRequestPasswordResetApiArg,
  usePostAuthRequestPasswordResetMutation
} from '@/api/accountApi';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Typography } from '@/components/common/Typography';
import { LOGIN_PATH } from '@/constants/routes';
import { parseQueryError } from '@/lib/helpers';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthCard from '@/components/ui/AuthCard';

interface IPasswordResetRequestForm {
  email: string;
}

export default function PasswordResetRequest() {
  const { register, handleSubmit, formState, setError, getValues } =
    useForm<IPasswordResetRequestForm>();
  const [isEmailSent, setEmailSent] = useState<boolean>(false);

  const [triggerRequest, { isLoading }] = usePostAuthRequestPasswordResetMutation();

  const submitHandler = async (formData: IPasswordResetRequestForm) => {
    const payload: PostAuthRequestPasswordResetApiArg = {
      body: {
        ...formData
      }
    };

    const result = await triggerRequest(payload);

    if (result.error) {
      const { message } = parseQueryError(result.error);

      setError('root', { message: message });
    } else {
      setEmailSent(true);
    }
  };

  return (
    <AuthCard
      formSubmitHandler={isEmailSent ? undefined : handleSubmit(submitHandler)}
      titleContent={isEmailSent ? null : 'Zresetuj hasło'}
      descriptionContent={
        isEmailSent ? (
          <>
            {'Link do zresetowania hasła został wysłany na e-mail: '}
            <span className="font-bold text-chart-2">{getValues('email')}</span>
          </>
        ) : (
          'Wprowadź swój e-mail, aby uzyskać link do zresetowania hasła.'
        )
      }
      mainContent={
        isEmailSent ? null : (
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

            {formState.errors.root && (
              <Typography variant="p" className="mt-2 text-center font-bold text-destructive">
                {formState.errors.root.message}
              </Typography>
            )}
          </>
        )
      }
      footerContent={
        isEmailSent ? (
          <Link href={LOGIN_PATH}>
            <Button>Wróć do logowania</Button>
          </Link>
        ) : (
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
        )
      }
    />
  );
}
