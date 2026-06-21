import Payment, { IPaymentModel } from '@models/Payment';
import Stripe from 'stripe';
import { TicketManager } from './ticketManager';
import { JwtPayload } from 'jsonwebtoken';
import {
  EPaymentIntentEvent,
  EPaymentIntentType,
  EPaymentStatus,
  EResponseStatus,
  ESupportedCurrency,
} from 'shared-types';
import { AppError, handleStripeError } from 'shared-backend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PaymentManager = {
  ticketPaymentHandler: async (user: JwtPayload, ticketId: string, amount: number, currency: ESupportedCurrency) => {
    if (!user) {
      throw new AppError(401, EResponseStatus.ERROR_USER_NOT_FOUND, 'Missing user data');
    }

    try {
      const payment = new Payment({
        user: user.userId,
        ticket: ticketId,
        amount: amount,
        currency: currency,
        status: EPaymentStatus.PENDING,
      });

      await payment.save();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: {
          type: EPaymentIntentType.TICKET,
          userId: user.userId,
          ticketId: ticketId,
          paymentId: payment.id,
        },
        payment_method_types: ['blik'],
      });

      return {
        payment: payment,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      handleStripeError(err);
    }
  },
  stripeWebhookHandler: async (payload: string, signature: string | string[]) => {
    try {
      const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
      const intent = event.data.object as Stripe.PaymentIntent;
      const { paymentId, type } = intent.metadata;

      switch (event.type) {
        case EPaymentIntentEvent.PAYMENT_SUCCEEDED:
          const payment = await Payment.findByIdAndUpdate(paymentId, {
            status: EPaymentStatus.SUCCEEDED,
          });

          if (type === EPaymentIntentType.TICKET) {
            const { ticketId } = intent.metadata;

            await TicketManager.handleSuccessfulPayment(payment as IPaymentModel, ticketId);
          }

          break;

        case EPaymentIntentEvent.PAYMENT_FAILED:
          await Payment.findByIdAndUpdate(paymentId, {
            status: EPaymentStatus.FAILED,
          });

          break;

        default:
          return;
      }
    } catch (err) {
      handleStripeError(err);
    }
  },
};
