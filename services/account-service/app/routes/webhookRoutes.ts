import { stripeWebhookHandler } from '@controllers/webhookController';
import express from 'express';

const router = express.Router();

router.post('/stripe', stripeWebhookHandler);

export default router;
