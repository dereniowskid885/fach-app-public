const moduleAlias = require('module-alias');
require('../common/helpers/registerAliases')(moduleAlias);

const dbConnect = require('@helpers/dbConnect');
const express = require('express');
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const ticketRoutes = require('./app/routes/ticketRoutes');
const categoryRoutes = require('./app/routes/categoryRoutes');
const swaggerRoutes = require('./app/routes/swaggerRoutes');
const ROUTES = require('./app/constants/routeConstants');
const ROUTES_SWAGGER = require('@constants/swaggerConstants');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// services common envs
// require('dotenv').config({ path: require.resolve('@root/.env.shared') });
require('dotenv').config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    credentials: true,
  }),
);

dbConnect(mongoose, process.env.MONGO_URI);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use(ROUTES.AUTH.BASE, authRoutes);
app.use(ROUTES.USERS.BASE, adminRoutes);
app.use(ROUTES.TICKETS.BASE, ticketRoutes);
app.use(ROUTES.CATEGORY.BASE, categoryRoutes);
app.use(ROUTES_SWAGGER.BASE, swaggerRoutes);

app.listen(process.env.ACCOUNT_SERVICE_PORT, () => {
  console.log(`Account service is running on port ${process.env.ACCOUNT_SERVICE_PORT}`);
  console.log(`Swagger is available on: ${process.env.ACCOUNT_SERVICE_BASE_URL + ROUTES_SWAGGER.BASE}`);
});
