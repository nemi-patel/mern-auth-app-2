// Import necessary modules
const express = require('express');            // Web framework for Node.js
const bcrypt = require('bcryptjs');            // Library for hashing and comparing passwords
const User = require('../models/User');        // User model from Mongoose schema
const router = express.Router();               // Create an Express router instance

// ==========================
// Get user by username (optional utility)
// ==========================
router.get('/users/:username', async (req, res) => {
  const { username } = req.params;
  try {
    // Find user by username in database
    const user = await User.findOne({ username });
    res.status(200).json(user);               // Return user if found
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Internal server error
  }
});

// ==========================
// Register a new user
// ==========================
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });  // Success
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Internal server error
  }
});

// ==========================
// Login existing user
// ==========================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });  // Login success
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Internal server error
  }
});

// ==========================
// Delete user by ID (used for logout + delete account)
// ==========================
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);   // Find user by ID and delete
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });  // Internal server error
  }
});

// Export the router to be used in the main server
module.exports = router;
