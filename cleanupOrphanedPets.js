const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const User = require('./models/user');

async function cleanupOrphanedPets() {
  await mongoose.connect('mongodb+srv://jabr2023596273993:DfPGp0R4SiFs3Q1M@cluster0.zwcnvaf.mongodb.net/test?retryWrites=true&w=majority&authSource=admin');

  const users = await User.find({ status: 'active' }, '_id');
  const userIds = new Set(users.map(u => String(u._id)));

  const allPets = await Pet.find();
  const orphanedPets = allPets.filter(pet => !userIds.has(String(pet.userId)));

  if (orphanedPets.length > 0) {
    await Pet.deleteMany({ _id: { $in: orphanedPets.map(p => p._id) } });
    console.log(`Deleted ${orphanedPets.length} orphaned pets.`);
  } else {
    console.log('No orphaned pets found.');
  }

  await mongoose.disconnect();
}

cleanupOrphanedPets(); 