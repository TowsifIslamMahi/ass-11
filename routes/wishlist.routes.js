const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist'); // Your Mongoose Wishlist model

// POST: Add to wishlist
router.post('/', async (req, res) => {
  try {
    const { email, blogId, title, image } = req.body;
    if (!email || !blogId) {
      return res.status(400).json({ message: 'Email and blogId are required' });
    }
    const existing = await Wishlist.findOne({ email, blogId });
    if (existing) {
      return res.status(409).json({ message: 'Already in wishlist' });
    }
    const newWish = new Wishlist({ email, blogId, title, image });
    await newWish.save();
    res.status(201).json(newWish);
  } catch (err) {
    console.error('Add wishlist error:', err.message);
    res.status(500).json({ error: 'Server error: Could not add to wishlist.' });
  }
});

// GET: Get wishlist for a specific user
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res
      .status(400)
      .json({ message: 'Email is required to fetch wishlist' });
  }

  try {
    const wishlist = await Wishlist.find({ email });
    res.status(200).json(wishlist);
  } catch (err) {
    console.error('Fetch wishlist error:', err.message);
    res.status(500).json({ error: 'Server error: Could not fetch wishlist.' });
  }
});

// DELETE: Remove from wishlist
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Delete wishlist error:', err.message);
    res
      .status(500)
      .json({ error: 'Server error: Could not delete from wishlist.' });
  }
});

module.exports = router;
