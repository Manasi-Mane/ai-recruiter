const Profile = require('../models/Profile');
const User = require('../models/User');

// GET all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single candidate
exports.getCandidate = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Candidate not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SHORTLIST candidate
exports.shortlistCandidate = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Candidate not found' });

    profile.isShortlisted = !profile.isShortlisted;
    await profile.save();

    res.json({ message: `Candidate ${profile.isShortlisted ? 'shortlisted' : 'removed from shortlist'}`, profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};