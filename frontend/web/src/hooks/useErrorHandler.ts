import { EErrorStrategy } from '@/constants/enums';
import { LOGIN_PATH } from '@/constants/routes';
import { parseQueryError, mapErrorStatusToMessageKey } from '@/lib/errorUtils';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface IErrorHandler {
  callback?: () => void;
  setInlineError?: (message: string) => void;
  redirectTo?: (path: string) => void;
}

/**
 * Centralized RTK Query error handler hook.
 */
export const useErrorHandler = (
  error: FetchBaseQueryError | SerializedError | undefined,
  options?: IErrorHandler
) => {
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    if (!error) return;

    options?.callback?.();

    const { status } = parseQueryError(error);
    const { strategy, messageKey } = mapErrorStatusToMessageKey(status);

    const message = t.has(messageKey) ? t(messageKey) : t('errors.generic');

    switch (strategy) {
      case EErrorStrategy.INLINE:
        options?.setInlineError?.(message);
        break;

      case EErrorStrategy.REDIRECT:
        if (options?.redirectTo) {
          options.redirectTo(LOGIN_PATH);
        } else {
          router.push(LOGIN_PATH);
        }
        break;

      case EErrorStrategy.TOAST:
        toast.error(message);
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
};
