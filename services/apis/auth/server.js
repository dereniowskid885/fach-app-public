const moduleAlias = require('module-alias');
require('../../helpers/registerAliases')(moduleAlias);

const dbConnect = require('@helpers/dbConnect');
const express = require('express');
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const swaggerRoutes = require('./app/routes/swaggerRoutes');
const ROUTES = require('./app/constants/routeConstants');
const ROUTES_SWAGGER = require('@constants/swaggerConstants');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.static('./app/public'));

// services common envs
require('dotenv').config({ path: require.resolve('@root/.env.shared') });
require('dotenv').config();

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true,
  }),
);

dbConnect(mongoose, process.env.MONGO_URI);

// TODO:
// add authMiddleware: https://github.com/rozwijacze/issue-solver/issues/62

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use(ROUTES.AUTH.BASE, authRoutes);
app.use(ROUTES.USERS.BASE, adminRoutes);
app.use(ROUTES_SWAGGER.BASE, swaggerRoutes);

app.listen(process.env.AUTH_SERVICE_PORT, () => {
  console.log(`Auth service is running on port ${process.env.AUTH_SERVICE_PORT}`);
  console.log(`Swagger is available on: ${process.env.AUTH_SERVICE_BASE_URL + ROUTES_SWAGGER.BASE}`);
});
