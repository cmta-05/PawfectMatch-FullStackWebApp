const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Pet = require('./Pet');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre('findOneAndDelete', async function(next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await Pet.deleteMany({ userId: String(doc._id) });
  }
  next();
});

userSchema.pre('findByIdAndDelete', async function(next) {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) {
    await Pet.deleteMany({ userId: String(doc._id) });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
