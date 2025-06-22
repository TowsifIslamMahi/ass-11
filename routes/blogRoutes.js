const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// ✅ Create new blog
router.post('/', async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add blog', error });
  }
});

// ✅ Get all blogs (with optional search and category filter)
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) query.$text = { $search: search };
  if (category) query.category = category;

  try {
    const blogs = await Blog.find(query);
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all blogs by user (My Blogs)
router.get('/my-blogs', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email query param is required' });
  }

  try {
    const blogs = await Blog.find({ ownerEmail: email }); // Use correct key
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user blogs' });
  }
});

// ✅ Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get top 10 featured blogs by word count
router.get('/featured/top', async (req, res) => {
  try {
    const blogs = await Blog.find();
    const sorted = blogs
      .map(blog => ({
        ...blog._doc,
        wordCount: blog.long_description?.split(' ').length || 0,
      }))
      .sort((a, b) => b.wordCount - a.wordCount)
      .slice(0, 10);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update blog by ID
router.put('/:id', async (req, res) => {
  const { email, title, image, category, short_description, long_description } =
    req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.ownerEmail !== email) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to edit this blog' });
    }

    blog.title = title;
    blog.image = image;
    blog.category = category;
    blog.short_description = short_description;
    blog.long_description = long_description;

    await blog.save();
    res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete blog by ID
router.delete('/:id', async (req, res) => {
  const email = req.query.email;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.ownerEmail !== email) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
