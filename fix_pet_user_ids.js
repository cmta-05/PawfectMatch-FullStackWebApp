const mongoose = require('mongoose');
const User = require('./models/user');
const Pet = require('./models/Pet');

const MONGODB_URI = 'mongodb+srv://jabr2023596273993:DfPGp0R4SiFs3Q1M@cluster0.zwcnvaf.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

async function printPetOwnerInfo() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const users = await User.find({}, '_id email name status');
  const userMap = new Map(users.map(u => [String(u._id), u]));

  const pets = await Pet.find();
  let missing = 0;
  let inactive = 0;
  let noName = 0;

  for (const pet of pets) {
    const user = userMap.get(String(pet.userId));
    if (!user) {
      console.log(`Pet ${pet.name} (${pet._id}) references missing userId: ${pet.userId}`);
      missing++;
    } else {
      let warn = '';
      if (user.status !== 'active') { warn += ' [INACTIVE USER]'; inactive++; }
      if (!user.name) { warn += ' [NO NAME]'; noName++; }
      console.log(`Pet ${pet.name} (${pet._id}) -> Owner: ${user.name || 'NO NAME'} (${user.email}), Status: ${user.status}${warn}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`Pets with missing user: ${missing}`);
  console.log(`Pets with inactive user: ${inactive}`);
  console.log(`Pets with user missing name: ${noName}`);
  console.log('Done.');
  await mongoose.disconnect();
}

printPetOwnerInfo().catch(err => {
  console.error(err);
  process.exit(1);
}); 