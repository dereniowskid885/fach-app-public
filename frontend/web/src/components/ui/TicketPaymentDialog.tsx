import { useEffect, useState } from 'react';
import DialogComponent from '../common/DialogComponent';
import { parseQueryError } from '@/lib/utils';
import { usePostTicketsByIdPaymentMutation } from '@/api/accountApi';
import { ESupportedCurrency } from '@/constants/supportedCurrency';
import { StripePaymentForm } from './StripePaymentForm';
import { StripeProvider } from '../providers/StripeProvider';
import { useTranslations } from 'next-intl';

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

  const [trigger, { isLoading }] = usePostTicketsByIdPaymentMutation();

  useEffect(() => {
    const submitHandler = async () => {
      if (!ticketId || !amount || !currency) return;

      const result = await trigger({
        id: ticketId,
        body: {
          amount,
          currency
        }
      }).then(data => {
        loadingEndHandler();

        return data;
      });
      const { error, data: responseData } = result;
      const isSuccess = !error;

      if (isSuccess) {
        setClientSecret(responseData?.data?.clientSecret ?? '');
      } else {
        const { message } = parseQueryError(result.error);

        setErrorMessage(message);
      }
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
      title="Wypełnij dane płatności"
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
