import { SWAGGER_ROUTES } from 'shared-types';
import { dbConnect } from 'shared-backend';
import authRoutes from '@routes/authRoutes';
import userRoutes from '@routes/userRoutes';
import ticketRoutes from '@routes/ticketRoutes';
import categoryRoutes from '@routes/categoryRoutes';
import swaggerRoutes from '@routes/swaggerRoutes';
import webhookRoutes from '@routes/webhookRoutes';
import notificationsRoutes from '@routes/notificationRoutes';
import { ROUTES } from '@constants/routeConstants';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './models';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true,
  }),
);

dbConnect(mongoose, process.env.MONGO_URI ?? '');

// Webhooks
app.use(ROUTES.WEBHOOKS, express.raw({ type: 'application/json' }), webhookRoutes);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use(ROUTES.AUTH, authRoutes);
app.use(ROUTES.USERS, userRoutes);
app.use(ROUTES.TICKETS, ticketRoutes);
app.use(ROUTES.CATEGORIES, categoryRoutes);
app.use(ROUTES.NOTIFICATIONS, notificationsRoutes);

// Swagger
app.use(SWAGGER_ROUTES.BASE, swaggerRoutes);

app.listen(process.env.ACCOUNT_SERVICE_PORT, () => {
  console.log(`Account service is running on port ${process.env.ACCOUNT_SERVICE_PORT}`);
  console.log(`Swagger is available on: ${process.env.ACCOUNT_SERVICE_BASE_URL + SWAGGER_ROUTES.BASE}`);
});
