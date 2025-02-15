'use client';

import { isTokenExpired, isTokenInvalid } from '@/lib/token';
import { Card, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Typography } from '@/components/ui/Typography';
import { accountVerifyHandler } from '@/lib/auth';
import { notFound, usePathname } from 'next/navigation';
import { AsyncCountdown } from '@/app/(auth)/verify/[token]/AsyncCountdown';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';

export default function AccountVerifyPage() {
  const [isAccountVerifySuccess, setIsAccountVerifySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const token = pathname.split('/')[2];
  const tokenInvalid = isTokenInvalid(token);

  if (tokenInvalid) {
    notFound();
  }

  const tokenExpired = isTokenExpired(token);

  useEffect(() => {
    const verifyHandler = async () => {
      if (!tokenExpired) {
        try {
          const result = await accountVerifyHandler({ token });
          setIsAccountVerifySuccess(result.success);
        } catch (e) {
          console.log(e);
        }
      }
      setIsLoading(false);
    };

    verifyHandler();
  }, [token, tokenExpired]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4">
        <CardTitle>
          <Typography variant="h3" className="text-center font-normal text-white">
            {tokenExpired ? (
              'Link do aktywacji konta wygasł'
            ) : isAccountVerifySuccess ? (
              <AsyncCountdown />
            ) : (
              'Weryfikacja konta nie powiodła się.'
            )}
          </Typography>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
