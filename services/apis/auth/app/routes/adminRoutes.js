const express = require('express');
const { updateUserRole, deleteUser, getAllUsers, getUser } = require('../controllers/adminController');

const router = express.Router();

router.get(`/`, getAllUsers);
router.get(`/:userId`, getUser);
router.put(`/:userId/role`, updateUserRole);
router.delete(`/:userId`, deleteUser);

module.exports = router;
