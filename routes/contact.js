const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/submit', contactController.submitContactForm);
router.get('/all', contactController.getAllContacts);

module.exports = router; 