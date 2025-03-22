'use client';

import { Card, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Typography } from '@/components/ui/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { AsyncCountdown } from '@/components/ui/AsyncCountdown';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import {
  PostAuthEmailVerificationApiArg,
  usePostAuthEmailVerificationMutation
} from '@/api/authApi';
import { HOME_PATH, LOGIN_PATH } from '@/constants/routes';
import { parseQueryError } from '@/lib/helpers';
import { EAccountVerificationResult } from '@/constants/enums';

export default function AccountVerifyPage() {
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<EAccountVerificationResult>(
    EAccountVerificationResult.ERROR
  );

  const pathname = usePathname();
  const token = pathname.split('/')[2];

  const [triggerEmailVerify, { isLoading, isUninitialized }] =
    usePostAuthEmailVerificationMutation();

  const countdownDefaultProps = {
    description: 'Przekierowanie do logowania za ',
    buttonText: 'Przejdź do logowania',
    endOfCountdownHandler: () => router.push(LOGIN_PATH)
  };

  const asyncCountdownProps = {
    [EAccountVerificationResult.SUCCESS]: {
      title: 'Konto zostało aktywowane!',
      description: 'Przekierowanie do aplikacji za ',
      buttonText: 'Przejdź do aplikacji',
      endOfCountdownHandler: () => router.push(HOME_PATH)
    },
    [EAccountVerificationResult.ERROR]: {
      title: 'Wystąpił błąd podczas weryfikacji',
      ...countdownDefaultProps
    },
    [EAccountVerificationResult.TOKEN_EXPIRED]: {
      title: 'Link do aktywacji konta wygasł',
      ...countdownDefaultProps
    },
    [EAccountVerificationResult.TOKEN_INVALID]: {
      title: 'Nieprawidłowy link',
      ...countdownDefaultProps
    },
    [EAccountVerificationResult.ALREADY_VERIFIED]: {
      title: 'Konto jest już aktywne',
      ...countdownDefaultProps
    }
  };

  useEffect(() => {
    const verifyHandler = async () => {
      const payload: PostAuthEmailVerificationApiArg = {
        body: {
          token: token
        }
      };

      const result = await triggerEmailVerify(payload);
      const isMutationSuccess = !result.error;

      if (isMutationSuccess) {
        setVerificationResult(EAccountVerificationResult.SUCCESS);
        return;
      }

      const { status } = parseQueryError(result.error);

      switch (status) {
        case 400:
          setVerificationResult(EAccountVerificationResult.TOKEN_INVALID);
          break;

        case 409:
          setVerificationResult(EAccountVerificationResult.ALREADY_VERIFIED);
          break;

        case 410:
          setVerificationResult(EAccountVerificationResult.TOKEN_EXPIRED);
          break;
      }
    };

    verifyHandler();
  }, []);

  return isUninitialized ? null : isLoading ? (
    <LoadingSpinner />
  ) : (
    <Card className="w-screen rounded-none border-none bg-primary-800 sm:w-auto sm:min-w-[400px]">
      <CardHeader className="space-y-4">
        <CardTitle>
          <Typography variant="h3" className="text-center font-normal text-white">
            <AsyncCountdown {...asyncCountdownProps[verificationResult]} />
          </Typography>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
