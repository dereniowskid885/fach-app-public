const express = require('express');
const { updateUserRole, deleteUser, getAllUsers, getUser } = require('../controllers/adminController');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: Returns a list of all users with basic information such as user ID, email, and role.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: The unique identifier of the user
 *                     example: "64f3b12a6f4c1e9d3a7b1234"
 *                   email:
 *                     type: string
 *                     description: The user's email address
 *                     example: "user@example.com"
 *                   role:
 *                     type: string
 *                     description: The user's role in the system
 *                     example: "admin"
 *       400:
 *         description: Bad request - An error occurred while fetching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve users"
 */
router.get(`/`, getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves user details based on the provided user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User's unique ID
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                 role:
 *                   type: string
 *                   description: User's role in the system
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error. Couldnt find user with specified id.
 */
router.get(`/:userId`, getUser);

/**
 * @swagger
 * /users/update-role:
 *   put:
 *     summary: Update user role
 *     description: Updates the role of a user based on the provided user ID and new role.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Unique identifier of the user
 *               newRole:
 *                 type: string
 *                 description: New role to assign to the user
 *                 enum: [user, specialist, admin]
 *     responses:
 *       200:
 *         description: Successfully updated user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User role updated to admin.
 *       400:
 *         description: Invalid role provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid role provided
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error. Couldnt update role.
 */
router.put(`/:userId/role`, updateUserRole);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user from the system based on the provided user ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique identifier of the user
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
 *                 message:
 *                   type: string
 *                   example: User user@example.com deleted successfully.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error. Couldnt delete user.
 */
router.delete(`/:userId`, deleteUser);

module.exports = router;
