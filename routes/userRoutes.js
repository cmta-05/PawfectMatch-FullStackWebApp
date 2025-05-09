const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Login user
router.post('/login', userController.loginUser);

// Create user
router.post('/', userController.createUser);

// Read all users
router.get('/', userController.getUsers);

// Read single user
router.get('/:id', userController.getUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
