import { isTokenExpired } from '@/lib/token';
import React from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Typography } from '@/components/ui/Typography';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { LOGIN_PATH } from '@/constants/routes';
import { accountVerifyHandler } from '@/lib/auth';

export interface IAccountVerifyPage {
  params: { token: string };
}

export default async function AccountVerifyPage({ params }: IAccountVerifyPage) {
  let isAccountVerifySuccess = false;

  const token = params.token;
  const tokenExpired = isTokenExpired(token);

  if (!tokenExpired) {
    const result = await accountVerifyHandler({ token });
    isAccountVerifySuccess = result.success;
  }

  return (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4">
        <CardTitle>
          <Typography variant="h3" className="text-center font-normal text-white">
            {isAccountVerifySuccess
              ? 'Konto zostało aktywowane!'
              : 'Link do aktywacji konta wygasł'}
          </Typography>
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
