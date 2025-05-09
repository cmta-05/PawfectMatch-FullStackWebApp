require('dotenv').config();
const app = require('./app');
const cors = require('cors');
const path = require('path');

// Debug: Check if .env is loaded
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is not set',
  JWT_SECRET: process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET is not set'
});

// Enable CORS
app.use(cors());

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
