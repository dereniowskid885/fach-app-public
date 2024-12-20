'use client';

import { accountVerifyHandler } from '@/lib/auth';
import { getLastPathSegment } from '@/lib/helpers';
import { getTokenPayload, isTokenExpired } from '@/lib/token';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Typography } from '@/components/ui/Typography';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { LOGIN_PATH } from '@/constants/routes';

export default function AccountVerifyPage() {
  const pathname = usePathname();
  const token = getLastPathSegment(pathname);
  const tokenExpired = isTokenExpired(token);
  const tokenPayload = getTokenPayload(token);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAccountVerifySuccess, setAccountVerifySuccess] = useState<boolean>(!tokenExpired);

  useEffect(() => {
    const verificationHandler = async () => {
      const result = await accountVerifyHandler({ token });

      if (result.success) {
        setAccountVerifySuccess(true);
      } else {
        setErrorMessage(result.error ?? '');
      }
    };

    verificationHandler();
  }, [token, tokenPayload.email]);

  return (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4">
        <CardTitle>
          {errorMessage ? (
            <Typography variant="h3" className="text-center font-normal text-error">
              {errorMessage}
            </Typography>
          ) : (
            <Typography variant="h3" className="text-center font-normal text-white">
              {isAccountVerifySuccess
                ? 'Konto zostało aktywowane!'
                : 'Link do aktywacji konta wygasł.'}
            </Typography>
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Link href={LOGIN_PATH}>
          <Button>Przejdź do logowania</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
