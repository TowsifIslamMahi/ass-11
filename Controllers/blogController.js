// controllers/blogController.js

const Blog = require('../models/Blog');

const getBlogs = async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    const blogs = await Blog.find(query);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

module.exports = {
  getBlogs,
  // other controllers like addBlog, deleteBlog etcx
};
