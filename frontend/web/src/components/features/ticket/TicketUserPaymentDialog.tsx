import { useEffect, useState } from 'react';
import DialogComponent from '@/components/ui/DialogComponent';
import {
  enhancedAccountApi,
  usePostTicketsByIdPaymentMutation
} from '@/services/api/enhanced/enhancedAccountApi';
import { ESupportedCurrency } from 'shared-types';
import { StripePaymentForm } from '../payment/StripePaymentForm';
import { StripeProvider } from '@/components/providers/StripeProvider';
import { useTranslations } from 'next-intl';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Currency } from '@/services/api/generated/accountApi';
import { CreditCard } from 'lucide-react';
import { useDispatch } from 'react-redux';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();

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
      headerContent={<CreditCard size={24} />}
      title={t('ticketPaymentDialog.title')}
      cancelButtonText={t('common.cancel')}
      cancelButtonHandler={closeDialog}
      content={
        <StripeProvider clientSecret={clientSecret}>
          <StripePaymentForm
            closePaymentDialog={() => {
              closeDialog();
              dispatch(
                enhancedAccountApi.util.invalidateTags([
                  { type: 'Ticket', id: ticketId },
                  { type: 'Ticketing' }
                ])
              );
            }}
          />
        </StripeProvider>
      }
      errorMessage={errorMessage}
    />
  );
}
