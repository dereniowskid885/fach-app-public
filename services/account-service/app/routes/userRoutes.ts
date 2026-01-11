import { createUser, deleteUser, getUsers, getUserById, updateUser, updateUserRole } from '@controllers/userController';

import express from 'express';
const router = express.Router();

import { createMiddleware } from '@shared/helpers/createMiddleware';
import { checkAndParseAccessToken, checkUserRole } from '@shared/middlewares/authMiddleware';
import {
  validateCreateUserMiddleware,
  validateUserRoleUpdateMiddleware,
  validateUserUpdateMiddleware,
} from 'middlewares/userValidationMiddleware';
import { EUserRole } from '@shared/constants/enums';

// Role middleware
const checkAdminRole = createMiddleware(checkUserRole, [EUserRole.ADMIN]);

// Auth middleware
const accessTokenMiddleware = createMiddleware(checkAndParseAccessToken, process.env.ACCESS_TOKEN_SECRET);
router.use(accessTokenMiddleware, checkAdminRole);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     description: Default role is "user", to create a specialist categoryName must be provided and role must be "specialist".
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - city
 *               - name
 *               - surname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               role:
 *                 type: string
 *                 enum:
 *                  - "user"
 *                  - "specialist"
 *                  - "admin"
 *               categoryName:
 *                 type: string
 *                 description: Specialist category name
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
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      example: "64a7b2f5c9e77e6f4d2e8b9a"
 *                    email:
 *                      type: string
 *                      example: "jan@kowalski.pl"
 *                    role:
 *                      type: string
 *                      example: "user"
 *                    name:
 *                      type: string
 *                      example: "Jan"
 *                    surname:
 *                      type: string
 *                      example: "Kowalski"
 *                    city:
 *                      type: string
 *                      example: "Warsaw"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_INVALID_DATA"
 *                 message:
 *                   type: string
 *                   example: "Field categoryName is required while creating specialist"
 *       403:
 *         description: Forbidden - Attempt to register with admin role
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_INVALID_DATA"
 *                 message:
 *                   type: string
 *                   example: "Cannot register user with admin role"
 *       409:
 *        description: Conflict - User with this email already exists
 *        content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_ALREADY_EXIST"
 *                 message:
 *                   type: string
 *                   example: "User with this email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/', validateCreateUserMiddleware, createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with filtering options
 *     description: Returns a list of users based on provided filtering criteria.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by user email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role (e.g., admin, specialist, user)
 *         example: "user"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by user category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by user city
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Fetched users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 dataLength:
 *                   type: number
 *                   example: 24
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f3b12a6f4c1e9d3a7b1234"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       name:
 *                         type: string
 *                         example: "Jan"
 *                       surname:
 *                         type: string
 *                         example: "Nowak"
 *                       category:
 *                         type: string
 *                         example: "Elektronika"
 *                       city:
 *                         type: string
 *                         example: "Warsaw"
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TOKEN_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No access token provided"
 *       403:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Required role is missing"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by id
 *     description: Returns user by id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f3b12a6f4c1e9d3a7b1234"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     name:
 *                       type: string
 *                       example: "Jan"
 *                     surname:
 *                       type: string
 *                       example: "Nowak"
 *                     category:
 *                       type: string
 *                       example: "Elektronika"
 *                     city:
 *                       type: string
 *                       example: "Warsaw"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "User with provided id not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TOKEN_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No access token provided"
 *       403:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Required role is missing"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user
 *     description: Updates user information based on the provided user id.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 category:
 *                   type: string
 *                 city:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f3b12a6f4c1e9d3a7b1234"
 *                     email:
 *                       type: string
 *                       example: "jan@kowalski.pl"
 *                     role:
 *                       type: string
 *                       example: "specialist"
 *                     name:
 *                       type: string
 *                       example: "Jan"
 *                     surname:
 *                       type: string
 *                       example: "Nowak"
 *                     category:
 *                       type: string
 *                       example: "Elektronika"
 *                     city:
 *                       type: string
 *                       example: "Warsaw"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: No data provided for update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_INVALID_DATA"
 *                 message:
 *                   type: string
 *                   example: "No data provided for update."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TOKEN_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No access token provided"
 *       403:
 *         description: Required role that allows this action is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Required role that allows this action is missing"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "User with provided id not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.patch('/:id', validateUserUpdateMiddleware, updateUser);

// TODO: create a comment while working on superadmin role addition
router.patch('/:id/role', validateUserRoleUpdateMiddleware, updateUserRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     description: Deletes the user from the system based on the provided user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_TOKEN_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: No access token provided"
 *       403:
 *         description: Invalid role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_INVALID_ROLE"
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Required role is missing"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "ERROR_USER_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "User with provided id not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: string
 *                   example: "SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.delete('/:id', deleteUser);

export default router;
