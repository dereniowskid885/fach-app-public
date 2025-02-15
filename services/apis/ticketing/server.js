const moduleAlias = require('module-alias');
require('../../helpers/registerAliases')(moduleAlias);

const dbConnect = require('@helpers/dbConnect');
const createMiddleware = require('@helpers/createMiddleware');
const { checkAndParseToken } = require('@middlewares/authMiddleware');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ROUTES = require('./app/constants/routeConstants');
const ticketRoutes = require('./app/routes/ticketRoutes');

// services common envs
require('dotenv').config({ path: require.resolve('@root/.env.shared') });

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true,
  }),
);

dbConnect(mongoose, process.env.MONGO_URI);

// middleware
const tokenVerifyMiddleware = createMiddleware(checkAndParseToken, jwt, process.env.ACCESS_TOKEN_SECRET);
app.use(express.json());
app.use(cookieParser());
app.use(tokenVerifyMiddleware);

// routes
app.use(ROUTES.TICKETS.BASE, ticketRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Ticketing service is running on port ${PORT}`);
});
