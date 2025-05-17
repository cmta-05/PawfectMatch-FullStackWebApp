const express = require('express');
const router = express.Router();
const matchRequestController = require('../controllers/matchRequestController');

// Send a match request
router.post('/', matchRequestController.sendMatchRequest);

// Get all match requests for a user (sent or received)
router.get('/', matchRequestController.getUserMatchRequests);

// Update match request status (accept/reject)
router.patch('/:id', matchRequestController.updateMatchRequestStatus);

module.exports = router; 