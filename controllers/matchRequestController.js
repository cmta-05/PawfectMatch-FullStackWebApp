const MatchRequest = require('../models/MatchRequest');
const Pet = require('../models/Pet');
const User = require('../models/User');

// Send a match request
exports.sendMatchRequest = async (req, res) => {
  try {
    const { sender, senderPet, receiver, receiverPet, message } = req.body;
    if (!sender || !senderPet || !receiver || !receiverPet) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const matchRequest = new MatchRequest({ sender, senderPet, receiver, receiverPet, message });
    await matchRequest.save();
    res.status(201).json(matchRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all match requests for a user (sent or received)
exports.getUserMatchRequests = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    // Find match requests where this user is either the sender or receiver
    const requests = await MatchRequest.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate('senderPet receiverPet')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update match request status (accept/reject)
exports.updateMatchRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const matchRequest = await MatchRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!matchRequest) return res.status(404).json({ message: 'Match request not found' });
    res.json(matchRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 