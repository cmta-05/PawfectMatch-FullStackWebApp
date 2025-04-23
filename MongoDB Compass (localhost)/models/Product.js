// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Product = mongoose.model('Product', productSchema);

export default Product;
