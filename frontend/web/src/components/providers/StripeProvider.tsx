'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface IStripeProvider {
  children: ReactNode;
  clientSecret: string;
}

export const StripeProvider = ({ children, clientSecret }: IStripeProvider) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe'
        }
      }}
    >
      {children}
    </Elements>
  );
};
