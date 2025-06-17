const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const blogRoutes = require('./routes/blogRoutes'); // Your blog routes
const wishlistRoutes = require('./routes/wishlist.routes'); // Your wishlist routes

const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI) // MONGO_URI should be defined in your .env file
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
// Mount the blog routes under '/blogs'
// This means requests to https://ass-11.onrender.com//blogs (GET for all, POST for add, GET /my-blogs etc.) will be handled by blogRoutes.js
app.use('/blogs', blogRoutes);

// Mount the wishlist routes under '/api/wishlist'
// This means requests to https://ass-11.onrender.com//api/wishlist will be handled by wishlistRoutes.js
app.use('/api/wishlist', wishlistRoutes);

// Simple test route to ensure the server is running
app.get('/', (req, res) => {
  res.send(
    `Server is running on port ${PORT}. MongoDB status: ${
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    }`
  );
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
