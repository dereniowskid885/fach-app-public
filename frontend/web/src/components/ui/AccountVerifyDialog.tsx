import React, { ReactNode, useEffect, useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import {
  PostAuthRequestEmailVerificationApiArg,
  usePostAuthRequestEmailVerificationMutation
} from '@/api/accountApi';
import { parseQueryError } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export interface IAccountVerifyDialog {
  open: boolean;
  closeDialogHandler: () => void;
  email: string;
  title: string;
  emailSentTitle?: string;
  description: string | ReactNode;
  emailSentDescription?: string;
}

export default function AccountVerifyDialog({
  open,
  email,
  title,
  emailSentTitle,
  description,
  emailSentDescription,
  closeDialogHandler
}: IAccountVerifyDialog) {
  const t = useTranslations();

  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [triggerVerifyRequest, { isLoading }] = usePostAuthRequestEmailVerificationMutation();

  useEffect(() => {
    // states reset on dialog open
    if (!open) return;

    setEmailSent(false);
    setErrorMessage('');
  }, [open]);

  const accountVerifyRequest = async () => {
    const payload: PostAuthRequestEmailVerificationApiArg = {
      body: {
        email
      }
    };

    const result = await triggerVerifyRequest(payload);
    const isMutationSuccess = !result.error;

    if (isMutationSuccess) {
      setEmailSent(true);
      setErrorMessage('');
    } else {
      const { message } = parseQueryError(result.error);

      setErrorMessage(message);
    }
  };

  return (
    <DialogComponent
      open={open}
      title={isEmailSent ? (emailSentTitle ?? title) : title}
      description={isEmailSent ? (emailSentDescription ?? description) : description}
      cancelButtonText={t('common.close')}
      confirmButtonText={isEmailSent ? undefined : t('common.sendLink')}
      cancelButtonHandler={closeDialogHandler}
      confirmButtonHandler={isEmailSent ? undefined : accountVerifyRequest}
      errorMessage={errorMessage}
      isLoadingConfirmButton={isLoading}
    />
  );
}
