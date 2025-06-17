const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Add Comment
router.post('/', async (req, res) => {
  try {
    const result = await Comment.create(req.body);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get Comments for Blog
router.get('/:blogId', async (req, res) => {
  try {
    const result = await Comment.find({ blogId: req.params.blogId });
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
