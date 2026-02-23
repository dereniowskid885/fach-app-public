import { useEffect, useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { usePostTicketsByIdPaymentMutation } from '@/api/accountApi';
import { ESupportedCurrency } from '@/constants/supportedCurrency';
import { StripePaymentForm } from './StripePaymentForm';
import { StripeProvider } from '../providers/StripeProvider';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface ITicketPaymentDialog {
  open: boolean;
  closeDialog: () => void;
  loadingStartHandler: () => void;
  loadingEndHandler: () => void;
  ticketId?: string;
  amount?: number;
  currency?: ESupportedCurrency;
}

export const TicketPaymentDialog = ({
  open,
  closeDialog,
  loadingStartHandler,
  loadingEndHandler,
  ticketId,
  amount,
  currency
}: ITicketPaymentDialog) => {
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
  }, [open, amount, currency, ticketId, trigger, loadingEndHandler, loadingStartHandler]);

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
};
