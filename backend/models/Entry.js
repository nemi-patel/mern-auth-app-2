// Import the mongoose module to define a schema and work with MongoDB
const mongoose = require('mongoose');

// Define a new schema for "Entry" documents
const entrySchema = new mongoose.Schema({  
  name: String,       // "name" field: stores a string (not marked as required here)
  email: String        // "email" field: stores a string (not marked as required here)
});

// Export the "Entry" model based on the schema
// Mongoose will create a collection named "entries" in MongoDB
module.exports = mongoose.model('Entry', entrySchema);
