const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String },
  skills: [{ type: String }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    techStack: String,
    link: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  completionPercent: { type: Number, default: 0 },
  lastSaved: { type: Date, default: Date.now },
  isShortlisted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Profile', ProfileSchema);