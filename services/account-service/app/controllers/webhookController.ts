import { PaymentManager } from '@managers/paymentManager';
import { IAppError, handleAppError } from 'shared-backend';
import { Request, Response } from 'express';

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'];

    await PaymentManager.stripeWebhookHandler(req.body, signature!);

    res.json({ received: true });
  } catch (err) {
    handleAppError(res, err as IAppError);
  }
};
