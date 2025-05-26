const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender:{
    type:String,
    enum:["male","female"]
  },
  post: [{
    type: mongoose.Schema.Types.ObjectId, // Store ID of the post
    ref: 'Post'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // Store ID of the post
    ref: 'Post'
  }],
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Example roles
    required: true,
    default:"user"
  }
  // followers: [{
  //   type: mongoose.Schema.Types.ObjectId, // User ID of followers
  //   ref: 'User'
  // }],
  // followings: [{
  //   type: mongoose.Schema.Types.ObjectId, // User ID of followings
  //   ref: 'User'
  // }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
