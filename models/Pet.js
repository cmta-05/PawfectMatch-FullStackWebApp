const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  profileImage: { type: String, default: '/uploads/default-pet.jpg' },
  userId: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema); 