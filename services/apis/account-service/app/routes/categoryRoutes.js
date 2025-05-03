const {
  getOrCreateCategory,
  getCategories,
  assignSpecialistToCategory,
  removeSpecialistFromCategory,
  getCategoryById,
} = require('../controllers/categoryController');

const express = require('express');
const jwt = require('jsonwebtoken');
const createMiddleware = require('@helpers/createMiddleware');
const { checkAndParseToken } = require('@middlewares/authMiddleware');

// Auth middleware
const tokenVerifyMiddleware = createMiddleware(checkAndParseToken, jwt, process.env.ACCESS_TOKEN_SECRET);
const router = express.Router();
router.use(tokenVerifyMiddleware);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories
 *     description: Returns all available categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique category ID
 *                     example: "66df7gh8sasd6f66767rt6"
 *                   name:
 *                     type: string
 *                     description: Unique category name
 *                     example: "Elektronika"
 *                   specialists:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                          _id:
 *                            type: string
 *                            description: User ID
 *                            example: "66df7gh8sasd6f66767rt6"
 *                          email:
 *                            type: string
 *                            description: User email
 *                            example: "jan@kowalski.pl"
 *       500:
 *         description: Server error during retrieval of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during retrieval of categories
 */
router.get('/', getCategories);

/**
 * @swagger
 * /categories/by-id/{id}:
 *   get:
 *     summary: Get category by id
 *     description: Returns category by id
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique category ID
 *                   example: "66df7gh8sasd6f66767rt6"
 *                 name:
 *                   type: string
 *                   description: Unique category name
 *                   example: "Elektronika"
 *                 specialists:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                          _id:
 *                            type: string
 *                            description: User ID
 *                            example: "66df7gh8sasd6f66767rt6"
 *                          email:
 *                            type: string
 *                            description: User email
 *                            example: "jan@kowalski.pl"
 *       500:
 *         description: Server error during retrieval of category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during retrieval of category
 */
router.get('/by-id/:id', getCategoryById);

/**
 * @swagger
 * /categories/by-name/{name}:
 *   get:
 *     summary: Get category by name or create one
 *     description: Returns category by name and creates one if it doesn't exist
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Category name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique category ID
 *                   example: "66df7gh8sasd6f66767rt6"
 *                 name:
 *                   type: string
 *                   description: Unique category name
 *                   example: "Elektronika"
 *                 specialists:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                          _id:
 *                            type: string
 *                            description: User ID
 *                            example: "66df7gh8sasd6f66767rt6"
 *                          email:
 *                            type: string
 *                            description: User email
 *                            example: "jan@kowalski.pl"
 *       500:
 *         description: Server error during retrieval of category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during retrieval of category
 */
router.get('/by-name/:name', getOrCreateCategory);

/**
 * @swagger
 * /categories/{id}/specialist/assign:
 *   patch:
 *     summary: Assign specialist to category
 *     description: Adds userId provided in body to category specialists array
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
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
 *         description: Specialist assigned to category successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Specialist assigned to category successfully
 *       400:
 *         description: Category with provided id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category with provided id does not exist
 *       500:
 *         description: Server error during category update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during category update
 */
router.patch('/:id/specialist/assign', assignSpecialistToCategory);

/**
 * @swagger
 * /categories/{id}/specialist/remove:
 *   patch:
 *     summary: Remove specialist from category
 *     description: Removes userId provided in body from category specialists array
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
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
 *         description: Specialist succesfully removed from category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Specialist succesfully removed from category
 *       400:
 *         description: Category with provided id does not exist or specialist was not assigned to this category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category with provided id does not exist
 *       500:
 *         description: Server error during category update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error during category update
 */
router.patch('/:id/specialist/remove', removeSpecialistFromCategory);

module.exports = router;
