import React, { useEffect, useState } from 'react';
import DialogComponent from './DialogComponent';
import { accountVerifyRequestHandler } from '@/lib/auth';

export interface IAccountVerifyDialog {
  open: boolean;
  closeDialogHandler: () => void;
  email: string;
  title: string;
  emailSentTitle?: string;
  description: string;
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
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // states reset on dialog open
    if (!open) return;

    setEmailSent(false);
    setErrorMessage('');
  }, [open]);

  const accountVerifyRequest = async () => {
    setLoading(true);
    const result = await accountVerifyRequestHandler({ email });

    if (result.success) {
      setEmailSent(true);
      setErrorMessage('');
    } else {
      setErrorMessage(result.error ?? '');
    }

    setLoading(false);
  };

  return (
    <DialogComponent
      open={open}
      title={isEmailSent ? (emailSentTitle ?? title) : title}
      description={isEmailSent ? (emailSentDescription ?? description) : description}
      cancelButtonText="Zamknij"
      confirmButtonText={isEmailSent ? '' : 'Wyślij link'}
      cancelButtonHandler={closeDialogHandler}
      confirmButtonHandler={isEmailSent ? undefined : accountVerifyRequest}
      errorMessage={errorMessage}
      isLoadingConfirmButton={isLoading}
    />
  );
}
