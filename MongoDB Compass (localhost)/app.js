
// app.js
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.js'; // ✅ Make sure this path is correct

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/project10DB')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/products', productRoutes); // This means POST to /products/add will hit your router
app.use(express.urlencoded({ extended: true }));

// ✅ Export app (used in bin/www)
export default app;
app.post('/your-endpoint', (req, res) => {
  console.log('POST request received:', req.body);
  res.send('Post request processed');
});
