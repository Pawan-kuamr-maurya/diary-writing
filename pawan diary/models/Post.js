const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true
    },
    ownwer: {
    type: mongoose.Schema.Types.ObjectId, // User ID of followers
    ref: 'User'
  },
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId, // User ID of users who liked the post
      ref: 'User'
    }],
    categoryList: [{
      type: String // List of categories
    }],
    visibility:{
      type: String,
      enum:["public","private"]
    },
    restrictionAge: {
      type: Boolean // Age restriction for the post
    },
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId, // User ID of the commenter
        ref: 'User'
      },
      comment: {
        type: String,
        required: true
      }
    }]
  });
  
  const Post = mongoose.model('Post', postSchema);
  module.exports = Post;
  