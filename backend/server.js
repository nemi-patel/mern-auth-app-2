// Importing required modules
const express = require('express');           // Web framework for Node.js
const mongoose = require('mongoose');         // ODM for MongoDB
const cors = require('cors');                 // Middleware to enable Cross-Origin Resource Sharing
const dotenv = require('dotenv');             // Module to load environment variables from a .env file

// Importing route handlers
const entryRoutes = require('./routes/entries'); // Routes for entry-related operations (CRUD, etc.)
const authRoutes = require('./routes/auth');     // Routes for authentication (login/register)

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware setup
app.use(cors());              // Enable CORS to allow requests from different origins
app.use(express.json());      // Middleware to parse incoming JSON requests

// Define routes for the API
app.use('/api/entries', entryRoutes);  // Mount entry routes at /api/entries
app.use('/api/auth', authRoutes);      // Mount auth routes at /api/auth

// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,             // Use the new URL parser
  useUnifiedTopology: true,          // Use the new server discovery and monitoring engine
})
.then(() => console.log('MongoDB connected'))          // Log success message if connection succeeds
.catch(err => console.log('Mongo Error:', err));       // Log error message if connection fails

// Start the server on the defined port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));


