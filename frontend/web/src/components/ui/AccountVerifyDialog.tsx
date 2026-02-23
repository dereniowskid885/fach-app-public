import React, { ReactNode, useEffect, useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import {
  PostAuthRequestEmailVerificationApiArg,
  usePostAuthRequestEmailVerificationMutation
} from '@/api/accountApi';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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

  const [triggerVerifyRequest, { isLoading, error }] =
    usePostAuthRequestEmailVerificationMutation();

  useErrorHandler(error, {
    setInlineError: message => setErrorMessage(message)
  });

  useEffect(() => {
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

    const { error } = await triggerVerifyRequest(payload);
    if (error) return;

    setEmailSent(true);
    setErrorMessage('');
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
