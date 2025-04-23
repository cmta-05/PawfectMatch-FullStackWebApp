// routes/product.js
import express from 'express';
import Product from '../models/Product.js'; // assumes Product.js is using export default

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/list', async (req, res) => {
  try {
    const products = await Product.find(); // assumes you already created Product model
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

export default router;