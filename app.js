const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Initialize Express app
const app = express();

// Load environment variables from .env
dotenv.config();

// Check if the MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const contactRoutes = require('./routes/contact');
const matchRequestRoutes = require('./routes/matchRequestRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());

// Serve static files from both public and frontend directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Frontend files')));
app.use(express.static(path.join(__dirname, 'Frontend files/css')));
app.use(express.static(path.join(__dirname, 'Frontend files/js')));
app.use(express.static(path.join(__dirname, 'Frontend files/images')));
app.use(express.static(path.join(__dirname, 'Frontend files/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/users', usersRouter);
app.use('/api/pets', petRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/match-requests', matchRequestRoutes);
app.use('/api/favorites', favoriteRoutes);

// Serve frontend HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'login.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'about.html'));
});

app.get('/browse', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'browse.html'));
});

app.get('/browse-pets', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'browse-pets.html'));
});

app.get('/add-pet', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'add-pet.html'));
});

app.get('/my-pets', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'my-pets.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend files', 'admin-dashboard.html'));
});

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
