const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  email: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true }, // Reference to Blog model
  title: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only add a specific blog to their wishlist once
wishlistSchema.index({ email: 1, blogId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
