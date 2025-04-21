const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // adjust path if needed

// POST /add – Insert a new product
router.post('/add', async (req, res) => {
  try {
    const newProduct = new Product(req.body); // assuming req.body has name, price, etc.
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /all – Get all products (view in browser)
// GET all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products); // Send them as JSON
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving products' });
    }
  });
  

module.exports = router;
