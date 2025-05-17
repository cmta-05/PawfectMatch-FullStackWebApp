const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);
router.get('/email/:email', userController.getUserByEmail);

// Protected routes
router.get('/', protect, authorize('admin'), userController.getUsers);
router.get('/:id', protect, authorize('admin'), userController.getUser);
router.put('/:id', protect, authorize('admin'), userController.updateUser);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router;
