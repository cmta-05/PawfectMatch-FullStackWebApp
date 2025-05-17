const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Add a pet to favorites
router.post('/add', favoriteController.addFavorite);
// Remove a pet from favorites
router.delete('/remove', favoriteController.removeFavorite);
// Get all favorites for a user
router.get('/:userId', favoriteController.getFavorites);

module.exports = router; 