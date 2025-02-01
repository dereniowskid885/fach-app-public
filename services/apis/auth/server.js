const moduleAlias = require('module-alias');
require('../../helpers/registerAliases')(moduleAlias);

const dbConnect = require('@helpers/dbConnect');
const express = require('express');
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const ROUTES = require('./app/constants/routeConstants');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

// services common envs
require('dotenv').config({ path: require.resolve('@root/.env.shared') });
require('dotenv').config();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});
