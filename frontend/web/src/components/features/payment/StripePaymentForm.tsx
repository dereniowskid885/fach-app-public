import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/shadcn/button';
import Typography from '@/components/ui/Typography';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useGetTicketsMyQuery } from '@/services/api/generated/accountApi';
import { Spinner } from '@/components/shadcn/spinner';

export interface IStripePaymentForm {
  closePaymentDialog: () => void;
}

export const StripePaymentForm = ({ closePaymentDialog }: IStripePaymentForm) => {
  const t = useTranslations();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const stripe = useStripe();
  const elements = useElements();

  const { refetch } = useGetTicketsMyQuery({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    const previousPath = window.location.pathname;
    const redirectUrl = `${window.location.origin}${previousPath}`;

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: redirectUrl
      }
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message ?? t('errors.paymentFailed'));

      return;
    }

    setTimeout(() => {
      closePaymentDialog();
      refetch();
      toast.success(t('ticketPaymentDialog.toastTitle'));
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <PaymentElement className="w-full" />

      <Button disabled={!stripe || isLoading} className="w-1/3">
        {isLoading ? <Spinner /> : null}

        {t('common.confirm')}
      </Button>

      {errorMessage ? (
        <Typography variant="p" className="text-destructive text-center font-bold">
          {errorMessage}
        </Typography>
      ) : null}
    </form>
  );
};
