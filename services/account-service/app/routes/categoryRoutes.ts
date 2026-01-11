import {
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
  assignSpecialistToCategory,
  removeSpecialistFromCategory,
  createCategory,
} from '@controllers/categoryController';

import express from 'express';
const router = express.Router();

import { createMiddleware } from '@shared/helpers/createMiddleware';
import { checkAndParseAccessToken, checkUserRole } from '@shared/middlewares/authMiddleware';
import { EUserRole } from '@shared/constants/enums';
import { validateCategoryBodyMiddleware } from '@middlewares/categoryValidationMiddleware';

// Role middleware
const checkAdminRole = createMiddleware(checkUserRole, [EUserRole.ADMIN]);

// Auth middleware
const accessTokenMiddleware = createMiddleware(checkAndParseAccessToken, process.env.ACCESS_TOKEN_SECRET);
router.use(accessTokenMiddleware);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     description: Creates a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Elektronika"
 *     responses:
 *       201:
 *         description: Category successfully created
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
 *                   example: Category successfully created.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Unique category name
 *                       example: "Elektronika"
 *                     specialists:
 *                      type: array
 *                      example: []
 *       400:
 *         description: Bad request
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
 *                   example: "Invalid category data provided."
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
 *       409:
 *         description: Category already exists
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
 *                   example: "ERROR_CATEGORY_ALREADY_EXISTS"
 *                 message:
 *                   type: string
 *                   example: "Category with provided name already exists."
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
router.post('/', checkAdminRole, validateCategoryBodyMiddleware, createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories with filtering options
 *     description: Returns all available categories
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Category name to filter by
 *     responses:
 *       200:
 *         description: Array of categories
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
 *                   example: "24"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique category ID
 *                         example: "66df7gh8sasd6f66767rt6"
 *                       name:
 *                         type: string
 *                         description: Unique category name
 *                         example: "Elektronika"
 *                       specialists:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "64f3b12a6f4c1e9d3a7b1234"
 *                             email:
 *                               type: string
 *                               example: "user@example.com"
 *                             role:
 *                               type: string
 *                               example: "specialist"
 *                             name:
 *                               type: string
 *                               example: "Jan"
 *                             surname:
 *                               type: string
 *                               example: "Nowak"
 *                             city:
 *                               type: string
 *                               example: "Warsaw"
 *                             isVerified:
 *                               type: boolean
 *                               example: true
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
router.get('/', getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by id
 *     description: Returns category by id
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category object
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
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Unique category name
 *                       example: "Elektronika"
 *                     specialists:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                             _id:
 *                               type: string
 *                               example: "64f3b12a6f4c1e9d3a7b1234"
 *                             email:
 *                               type: string
 *                               example: "user@example.com"
 *                             role:
 *                               type: string
 *                               example: "specialist"
 *                             name:
 *                               type: string
 *                               example: "Jan"
 *                             surname:
 *                               type: string
 *                               example: "Nowak"
 *                             city:
 *                               type: string
 *                               example: "Warsaw"
 *                             isVerified:
 *                               type: boolean
 *                               example: true
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
 *       404:
 *         description: Category with provided id does not exist
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              success:
 *                type: boolean
 *                example: false
 *              status:
 *                type: string
 *                example: "ERROR_CATEGORY_NOT_FOUND"
 *              message:
 *                type: string
 *                example: "Category with provided id does not exist."
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
router.get('/:id', getCategoryById);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Remove category by id
 *     description: Removes category by id
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category successfully removed
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
 *                   example: Category successfully removed.
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
 *       409:
 *         description: Cannot remove category with assigned specialists
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
 *                   example: "ERROR_CATEGORY_HAS_ASSIGNED_SPECIALISTS"
 *                 message:
 *                   type: string
 *                   example: Cannot remove category with assigned specialists.
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
router.delete('/:id', checkAdminRole, deleteCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category
 *     description: Updates category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New category name"
 *     responses:
 *       200:
 *         description: Category name successfully updated
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
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Unique category name
 *                       example: "Elektronika"
 *                     specialists:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f3b12a6f4c1e9d3a7b1234"
 *                           email:
 *                             type: string
 *                             example: "user@example.com"
 *                           role:
 *                             type: string
 *                             example: "specialist"
 *                           name:
 *                             type: string
 *                             example: "Jan"
 *                           surname:
 *                             type: string
 *                             example: "Nowak"
 *                           city:
 *                             type: string
 *                             example: "Warsaw"
 *                           isVerified:
 *                             type: boolean
 *                             example: true
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
 *         description: Category with provided id does not exist
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
 *                   example: "ERROR_CATEGORY_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "Category with provided id does not exist."
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
router.patch('/:id', checkAdminRole, validateCategoryBodyMiddleware, updateCategory);

/**
 * @swagger
 * /categories/{id}/specialist/assign:
 *   patch:
 *     summary: Assign specialist to category
 *     description: Assign specialist to category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67c48e3fd50f0e2e0050381d"
 *     responses:
 *       200:
 *         description: Specialist successfully assigned to a category
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
 *                   example: Specialist successfully assigned to a category
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Unique category name
 *                       example: "Elektronika"
 *                     specialists:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f3b12a6f4c1e9d3a7b1234"
 *                           email:
 *                             type: string
 *                             example: "jan@fachowiec.pl"
 *                           role:
 *                             type: string
 *                             example: "specialist"
 *                           name:
 *                             type: string
 *                             example: "Jan"
 *                           surname:
 *                             type: string
 *                             example: "Nowak"
 *                           city:
 *                             type: string
 *                             example: "Warsaw"
 *       400:
 *         description: User is not a specialist
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
 *                   example: User is not a specialist
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
 *         description: Category with provided id does not exist
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
 *                   example: "ERROR_CATEGORY_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: Category with provided id does not exist
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
 *                   example: Server error
 */
router.patch('/:id/specialist/assign', checkAdminRole, assignSpecialistToCategory);

/**
 * @swagger
 * /categories/{id}/specialist/remove:
 *   patch:
 *     summary: Remove specialist from category
 *     description: Remove specialist from category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique category ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67c48e3fd50f0e2e0050381d"
 *     responses:
 *       200:
 *         description: Specialist successfully removed from category
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
 *                   example: Specialist successfully removed from category
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique category ID
 *                       example: "66df7gh8sasd6f66767rt6"
 *                     name:
 *                       type: string
 *                       description: Unique category name
 *                       example: "Elektronika"
 *                     specialists:
 *                       type: array
 *                       example: []
 *       400:
 *         description: User is not assigned to provided category
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
 *                   example: "ERROR_USER_NOT_ASSIGNED_TO_CATEGORY"
 *                 message:
 *                   type: string
 *                   example: User is not assigned to provided category
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
 *         description: Category with provided id does not exist
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
 *                   example: "ERROR_CATEGORY_NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: Category with provided id does not exist
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
 *                   example: Server error
 */
router.patch('/:id/specialist/remove', checkAdminRole, removeSpecialistFromCategory);

export default router;
