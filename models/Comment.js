const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blogId: String,
  userEmail: String,
  userName: String,
  userPhoto: String,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
