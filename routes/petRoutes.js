const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');
const MatchRequest = require('../models/MatchRequest');

// Multer setup for image uploads
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create a new pet with image upload
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const petData = req.body;
    
    // Defensive: If gender is an array, take the first value
    if (Array.isArray(petData.gender)) {
      petData.gender = petData.gender[0];
    }
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'breed', 'age', 'gender', 'location', 'description', 'userId'];
    const missingFields = requiredFields.filter(field => !petData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate gender
    if (!['Male', 'Female'].includes(petData.gender)) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be either "Male" or "Female"'
      });
    }

    // Handle image upload
    if (req.file) {
      petData.profileImage = '/uploads/' + req.file.filename;
    } else {
      // Set a default image if none provided
      petData.profileImage = '/uploads/default-pet.jpg';
    }

    // Create and save the pet
    const pet = new Pet(petData);
    await pet.save();

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: pet
    });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating pet',
      error: error.message
    });
  }
});

// Get all pets (optionally filter by userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let pets;
    if (userId) {
      pets = await Pet.find({ userId });
    } else {
      pets = await Pet.find();
    }
    // Clean up pets with non-existent or inactive users
    const users = await User.find({ status: 'active' }, '_id name');
    const userMap = new Map(users.map(u => [String(u._id), u.name]));
    const userIds = new Set(users.map(u => String(u._id)));
    const orphanedPets = pets.filter(pet => !userIds.has(String(pet.userId)));
    if (orphanedPets.length > 0) {
      await Pet.deleteMany({ _id: { $in: orphanedPets.map(p => p._id) } });
      pets = pets.filter(pet => userIds.has(String(pet.userId)));
    }
    // Add ownerName to each pet
    const petsWithOwner = pets.map(pet => ({
      ...pet.toObject(),
      ownerName: userMap.get(String(pet.userId)) || 'Unknown'
    }));
    res.json(petsWithOwner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a pet by ID (with image upload support)
router.post('/:id/update', upload.single('profileImage'), async (req, res) => {
  try {
     const updateData = req.body;
     const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Defensive: If gender is an array, take the first value
    if (Array.isArray(updateData.gender)) {
      updateData.gender = updateData.gender[0];
    }

     // Update only provided fields, keep existing for others
    pet.name = updateData.name || pet.name;
    pet.type = updateData.type || pet.type;
    pet.breed = updateData.breed || pet.breed;
    pet.age = updateData.age || pet.age;
    pet.gender = updateData.gender || pet.gender;
    pet.location = updateData.location || pet.location;
    pet.description = updateData.description || pet.description;
    pet.userId = updateData.userId || pet.userId;

    // Handle profile image
    if (req.file) {
     pet.profileImage = '/uploads/' + req.file.filename;
    }

   await pet.save();

    res.json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pet by ID (with image upload support)
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = req.body;
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Defensive: If gender is an array, take the first value
    if (Array.isArray(updateData.gender)) {
      updateData.gender = updateData.gender[0];
    }

    // Update only provided fields, keep existing for others
    pet.name = updateData.name || pet.name;
    pet.type = updateData.type || pet.type;
    pet.breed = updateData.breed || pet.breed;
    pet.age = updateData.age || pet.age;
    pet.gender = updateData.gender || pet.gender;
    pet.location = updateData.location || pet.location;
    pet.description = updateData.description || pet.description;
    pet.userId = updateData.userId || pet.userId;

    // Handle profile image
    if (req.file) {
      pet.profileImage = '/uploads/' + req.file.filename;
    }

    await pet.save();
    res.json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a pet by ID
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    // Delete all match requests where this pet is senderPet or receiverPet
    await MatchRequest.deleteMany({ $or: [ { senderPet: req.params.id }, { receiverPet: req.params.id } ] });
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 