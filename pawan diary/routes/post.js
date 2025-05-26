const express = require('express');
const router = express.Router();
const USER = require("../models/User.js");
const Post = require("../models/Post.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isathenticate = require("../isvaliduser/Authentication.js");
const { convert } = require("html-to-text");
const options = {wordwrap: 130,};

router.get("/createpage", isathenticate, async (req, res, next) => {
  let { id } = req.user;
  try {
    let user = await USER.findById(id);
    res.status(200).render("./pages/createpost.ejs", { user });
  } catch (e) {
    next(e);
  }
});
router.post("/createpage", isathenticate, async (req, res, next) => {
  console.log(req.body);
  console.log(req.user);
  let { title, categoryList, visibility, restrictionAge, content } = req.body;
  let { id } = req.user;
  let ownwer = id;
  try {
    // Create a new post
    const newPost = new Post({
      title,
      categoryList,
      visibility,
      restrictionAge,
      content,
      ownwer,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Update the user schema with the new post ID
    await USER.findByIdAndUpdate(id, {
      $push: { post: savedPost._id }, // Add the post ID to the user's posts array
    });

    // Respond with the created post
    res.status(201).redirect("/post/createpage");
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Error creating post', error });
    next(error);
  }
});
router.post("/update",isathenticate, async (req, res, next) => {
  let { id, content, restrictionAge, visibility, categoryList } = req.body;
  console.log(content[0]);
  try {
    await Post.findByIdAndUpdate(id, {
      content: content[0],
      restrictionAge,
      visibility,
      categoryList,
    });

    res.redirect(`/user/profile/${req.user.id}`);
  } catch (e) {
    // res.send("not ok");
    next(e);
  }
});


router.get("/edit/:id", isathenticate, async (req, res, next) => {
  try {
    const posts = await Post.findOne({ _id: req.params.id });
    let { id } = req.user;

    if (posts.ownwer != id) {
      res.send("you is not owner");
    } else {
      res.render("pages/editpost.ejs", { posts });
    }
  } catch (e) {
    next(e);
  }
});
router.get("/delete/:id", isathenticate, async (req, res, next) => {
  console.log(req.params.id);
  try {
    const posts = await Post.findOne({ _id: req.params.id });
    let { id } = req.user;
    console.log(req.user + " " + posts.ownwer);

    if (posts.ownwer != id) {
      res.send("<h1>you is not owner</h1>");
    } else {
      const result = await Post.deleteOne({
        _id: req.params.id,
        ownwer: id,
      });

      res.redirect(`/user/profile/${req.user.id}`);
    }
  } catch (e) {
    next(e);
  }
});
router.get("/view/:id", isathenticate, async (req, res, next) => {
  let id2 = req.params.id;
  let { id } = req.user;

  let user = await USER.findById(id);

  let posts = await Post.findById(id2).populate("ownwer");
  console.log(user);
  

  res.render("pages/postview.ejs", { posts, user });
});


router.get("like/", isathenticate, async(req,res,next)=>{





})

router.post("like/:id", isathenticate, async(req,res,next)=>{





})




module.exports = router;