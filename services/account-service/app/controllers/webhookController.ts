import { PaymentManager } from '@managers/paymentManager';
import { handleAppError } from '@shared/helpers/handleAppError';
import { IAppError } from '@shared/utils/AppError';
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
