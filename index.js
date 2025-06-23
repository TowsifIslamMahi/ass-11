const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');
const wishlistRoutes = require('./routes/wishlist.routes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI) // MONGO_URI should be defined in your .env file
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/blogs', blogRoutes);

app.use('/api/wishlist', wishlistRoutes);

app.get('/', (req, res) => {
  res.send(
    `Server is running on port ${PORT}. MongoDB status: ${
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    }`
  );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
