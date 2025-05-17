const Favorite = require('../models/Favorite');

// Add a pet to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { userId, petId } = req.body;
    console.log('addFavorite called with:', { userId, petId });
    if (!userId || !petId) return res.status(400).json({ message: 'userId and petId are required.' });
    // Prevent duplicates
    const exists = await Favorite.findOne({ userId, petId });
    if (exists) return res.status(409).json({ message: 'Already in favorites.' });
    const favorite = new Favorite({ userId, petId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    console.error('addFavorite error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Remove a pet from favorites
exports.removeFavorite = async (req, res) => {
  try {
    // Accept from query (for DELETE) or body (for backward compatibility)
    const userId = req.query.userId || req.body.userId;
    const petId = req.query.petId || req.body.petId;
    if (!userId || !petId) return res.status(400).json({ message: 'userId and petId are required.' });
    const result = await Favorite.findOneAndDelete({ userId, petId });
    if (!result) return res.status(404).json({ message: 'Favorite not found.' });
    res.json({ message: 'Removed from favorites.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all favorites for a user
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required.' });
    const favorites = await Favorite.find({ userId }).populate('petId');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 