const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedUser = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: 'hire-me@anshumat.org' });
  if (existing) {
    console.log('Demo user already exists!');
    process.exit();
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('HireMe@2025!', salt);

  await User.create({
    name: 'Demo User',
    email: 'hire-me@anshumat.org',
    password,
    role: 'candidate'
  });

  console.log('Demo user seeded successfully!');
  process.exit();
};

seedUser();