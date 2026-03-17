import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { Button } from '../shadcn/button';
import Typography from '../common/Typography';

export const StripePaymentForm = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}`
      }
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message ?? 'Płatność nie powiodła się.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <PaymentElement className="w-full" />

      <Button disabled={!stripe || isLoading} loading={isLoading} className="w-1/3">
        Opłać
      </Button>

      {errorMessage ? (
        <Typography variant="p" className="text-center font-bold text-destructive">
          {errorMessage}
        </Typography>
      ) : null}
    </form>
  );
};
