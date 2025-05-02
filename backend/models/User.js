// Import the mongoose module to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Define a new schema for the "User" model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // "username" field: required and must be unique
  password: { type: String, required: true }    // "password" field: required
});

// Export the User model based on the schema
// This will create a "users" collection in MongoDB
module.exports = mongoose.model('User', userSchema);
