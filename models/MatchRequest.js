const mongoose = require('mongoose');

const matchRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderPet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverPet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('MatchRequest', matchRequestSchema); 