const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  requestPasswordReset,
  requestEmailVerificationLink,
  verifyEmail,
  passwordReset,
} = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's first name
 *               surname:
 *                 type: string
 *                 description: User's last name
 *               city:
 *                 type: string
 *                 description: User's city
 *     responses:
 *       201:
 *         description: User successfully registered in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered in database.
 *       207:
 *         description: Server error while sending the email verification link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error while sending email verification link.
 *       400:
 *         description: Invalid input data or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error during user registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during registration
 *                 error:
 *                   type: string
 */
router.post(`/register`, register);
router.post(`/login`, login);
router.post(`/refresh`, refreshToken);
router.post(`/logout`, logout);
router.post(`/email-verify-link`, requestEmailVerificationLink);
router.post(`/email-verify`, verifyEmail);
router.post(`/password-reset-link`, requestPasswordReset);
router.post(`/password-reset`, passwordReset);

module.exports = router;
