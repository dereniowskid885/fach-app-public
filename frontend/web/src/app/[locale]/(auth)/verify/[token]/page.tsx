'use client';

import { usePathname, useRouter } from 'next/navigation';
import AsyncCountdown from '@/components/ui/AsyncCountdown';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shadcn/loading-spinner';
import {
  PostAuthEmailVerificationApiArg,
  usePostAuthEmailVerificationMutation
} from '@/api/accountApi';
import { HOME_PATH, LOGIN_PATH } from '@/constants/routes';
import { parseQueryError } from '@/lib/utils';
import { EAccountVerificationResult } from '@/constants/enums';
import AuthCard from '@/components/ui/AuthCard';
import { useTranslations } from 'next-intl';
import { getLastPathSegment } from '@/lib/pathnameUtils';

export default function AccountVerifyPage() {
  const t = useTranslations();
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<EAccountVerificationResult>(
    EAccountVerificationResult.ERROR
  );

  const pathname = usePathname();
  const token = getLastPathSegment(pathname);

  const [triggerEmailVerify, { isLoading, isUninitialized }] =
    usePostAuthEmailVerificationMutation();

  const countdownDefaultProps = {
    description: t('accountVerifyPage.countdownDescription'),
    buttonText: t('common.goToLogin'),
    endOfCountdownHandler: () => router.push(LOGIN_PATH)
  };

  const asyncCountdownProps = {
    [EAccountVerificationResult.SUCCESS]: {
      title: t('accountVerifyPage.successTitle'),
      description: t('accountVerifyPage.countdownDescription'),
      buttonText: t('common.goToApp'),
      endOfCountdownHandler: () => router.push(HOME_PATH)
    },
    [EAccountVerificationResult.ERROR]: {
      title: t('accountVerifyPage.errorTitle'),
      ...countdownDefaultProps
    },
    [EAccountVerificationResult.TOKEN_INVALID]: {
      title: t('accountVerifyPage.tokenInvalidTitle'),
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

      const { code } = parseQueryError(result.error);

      setVerificationResult(
        code === 400 ? EAccountVerificationResult.TOKEN_INVALID : EAccountVerificationResult.ERROR
      );
    };

    verifyHandler();
  }, [token, triggerEmailVerify]);

  return isUninitialized ? null : isLoading ? (
    <LoadingSpinner />
  ) : (
    <AuthCard titleContent={<AsyncCountdown {...asyncCountdownProps[verificationResult]} />} />
  );
}
