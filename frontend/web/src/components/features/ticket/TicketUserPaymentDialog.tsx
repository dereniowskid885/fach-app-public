import { useEffect, useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import { usePostTicketsByIdPaymentMutation } from '@/services/api/enhanced/enhancedAccountApi';
import { ESupportedCurrency } from 'shared-types';
import { StripePaymentForm } from '../payment/StripePaymentForm';
import { StripeProvider } from '@/components/providers/StripeProvider';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Currency } from '@/services/api/generated/accountApi';

export interface ITicketUserPaymentDialog {
  open: boolean;
  closeDialog: () => void;
  loadingStartHandler: () => void;
  loadingEndHandler: () => void;
  ticketId?: string;
  amount?: number;
  currency?: ESupportedCurrency | Currency;
}

export default function TicketUserPaymentDialog({
  open,
  closeDialog,
  loadingStartHandler,
  loadingEndHandler,
  ticketId,
  amount,
  currency
}: ITicketUserPaymentDialog) {
  const t = useTranslations();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [trigger, { isLoading, error }] = usePostTicketsByIdPaymentMutation();

  useErrorHandler(error, {
    setInlineError: message => setErrorMessage(message)
  });

  useEffect(() => {
    const submitHandler = async () => {
      if (!ticketId || !amount || !currency) return;

      const { error, data: responseData } = await trigger({
        id: ticketId,
        body: {
          amount,
          currency
        }
      }).then(data => {
        loadingEndHandler();

        return data;
      });

      if (error) return;

      setClientSecret(responseData?.data?.clientSecret ?? '');
    };

    if (!open) return;

    loadingStartHandler();
    submitHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!clientSecret) return;

  return (
    <DialogComponent
      open={open}
      isLoadingConfirmButton={isLoading}
      title={t('ticketPaymentDialog.title')}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      content={
        <StripeProvider clientSecret={clientSecret}>
          <StripePaymentForm />
        </StripeProvider>
      }
      errorMessage={errorMessage}
    />
  );
}
