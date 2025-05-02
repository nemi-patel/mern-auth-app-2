// entries.js

// Import required modules
const express = require('express');                  // Express for creating routes
const Entry = require('../models/Entry');            // Mongoose model for Entry (name and email)
const User = require('../models/User');              // Mongoose model for User (not used here)
const router = express.Router();                     // Create an Express router

// =============================================
// GET /api/entries
// Fetch all entries from the database
// =============================================
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find();              // Fetch all documents from Entry collection
    res.json(entries);                               // Respond with JSON data
  } catch (err) {
    res.status(500).json({ error: 'Server error' }); // Handle errors gracefully
  }
});

// =============================================
// POST /api/entries
// Add a new entry with validation and duplicate check
// =============================================
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  // Check for required fields
  if (!name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if an entry with the same email already exists
    const exists = await Entry.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Duplicate email entry' }); // Conflict response
    }

    // Create and save the new entry
    const newEntry = new Entry({ name, email });
    await newEntry.save();

    res.status(201).json(newEntry);  // Respond with the created entry
  } catch (err) {
    res.status(500).json({ error: 'Server error' }); // Handle errors
  }
});

// =============================================
// PUT /api/entries/:id
// Update an existing entry by ID
// =============================================
router.put('/:id', async (req, res) => {
  try {
    const updated = await Entry.findByIdAndUpdate(
      req.params.id,               // ID from the URL
      req.body,                    // Updated data from request body
      { new: true }                // Option to return the updated document
    );
    res.json(updated);            // Respond with updated entry
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// =============================================
// DELETE /api/entries/:id
// Delete an entry by ID
// =============================================
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);     // Delete document by ID
    res.json({ message: 'Deleted successfully' });    // Respond with confirmation
  } catch (err) {
    res.status(500).json({ error: 'Server error' });  // Handle error
  }
});

// Export the router to be used in server.js
module.exports = router;
