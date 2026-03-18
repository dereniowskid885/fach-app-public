import Payment from '@models/Payment';
import { EPaymentIntentEvent, EPaymentIntentType, EPaymentStatus } from '@shared/enums/payment';
import { ESupportedCurrency } from '@shared/enums/currency';
import { EResponseStatus } from '@shared/enums/responseStatus';
import { AppError } from '@shared/utils/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { handleStripeError } from '@shared/helpers/handleStripeError';
import Stripe from 'stripe';
import { TicketManager } from './ticketManager';

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
          await Payment.findByIdAndUpdate(paymentId, {
            status: EPaymentStatus.SUCCEEDED,
          });

          if (type === EPaymentIntentType.TICKET) {
            const { ticketId } = intent.metadata;

            await TicketManager.handleSuccessfulPayment(ticketId);
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
