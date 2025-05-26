const express = require("express");
const router = express.Router();
const USER = require("../models/User.js");
const Post = require("../models/Post.js");
const isathenticate = require("../isvaliduser/Authentication.js");
const { convert } = require("html-to-text");
const options = { wordwrap: 130 };
router.get("/", isathenticate, async (req, res, next) => {
  try {
    let { id } = req.user;
    let posts;
    let user = await USER.findById(id);
    if (user.age > 18) {
      posts = await Post.find({ visibility: "public" }).populate("ownwer");
    } else {
      posts = await Post.find({
        visibility: "public",
        restrictionAge: false,
      }).populate("ownwer");
    }
    let sendtext = [];

    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];
      element.content = convert(element.content, options);
      sendtext.push(element);
    }
    res.status(201).render("pages/home.ejs", { user, sendtext });
  } catch (e) {
    next(e);
  }
});

router.get("/about", (req, res) => {
  res.render("pages/aboutus.ejs");
});
router.get("/contact", (req, res) => {
  res.render("pages/contactus.ejs");
});

router.post("/filter", isathenticate, async (req, res, next) => {
  let { search } = req.body;
  console.log(search);

  try {
    let { id } = req.user;
    let posts;
    let user = await USER.findById(id);
    if (user.age > 18) {
      posts = await Post.find({
        $and: [
          { visibility: "public" },
          {
            $or: [
              { title: new RegExp(search, "i") },
              { categoryList: new RegExp(search, "i") },
            ],
          },
        ],
      }).populate("ownwer");
    } else {
      posts = await Post.find({
        $and: [
          { visibility: "public" },
          {
            restrictionAge: false,
          },
          {
            $or: [
              { title: new RegExp(search, "i") },
              { categoryList: new RegExp(search, "i") },
            ],
          },
        ],
      }).populate("ownwer");
    }

    let sendtext = [];

    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];
      element.content = convert(element.content, options);
      sendtext.push(element);
    }

    console.log(sendtext);

    res.status(201).render("pages/home.ejs", { user, sendtext });
  } catch (e) {
    next(e);
  }

  // res.send("ok");
});

// Use CommonJS export
module.exports = router;
