const express = require('express');
const router = express.Router();
const USER = require("../models/User.js");
const Post = require("../models/Post.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isathenticate = require("../isvaliduser/Authentication.js");
const { convert } = require("html-to-text");
const options = {wordwrap: 130,};
router.get("/profile/:id", isathenticate, async (req, res, next) => {
  let { id } = req.user;
  console.log("kya");
  let id2=req.params.id;
  console.log(req.params.id+"   " +id);
  
  if(req.params.id==id){
    console.log("here");
    
  try {
    let user = await USER.findById(id).populate("post");
    let sendtext = [];
    for (let index = 0; index < user.post.length; index++) {
      const element = user.post[index];
      element.content = convert(element.content, options);
      sendtext.push(element);
    }
    res.render("pages/profile.ejs", { user, sendtext  ,id2});
  } catch (e) {
    next(e);
  }














  }else{
    console.log("there");
    
    let user = await USER.findById(id);
    let user2 = await USER.findById(req.params.id).populate("post");
    let sendtext = [];
    for (let index = 0; index < user2.post.length; index++) {

      const element = user2.post[index];
      if(element.visibility=="public"){
        element.content = convert(element.content, options);
      sendtext.push(element);}
    }
    res.render("pages/profile.ejs", { user, sendtext ,user2 ,id2});

  }












});
router.get("/reg", (req, res, next) => {
    res.render("pages/loginreg.ejs");
  });
router.post("/reg", async (req, res, next) => {
    console.log(req.body);
  
    const { name, age, username, password, gender } = req.body;
    if (!name || !username || !password || !age || !gender) {
      return res.status(400).send("Please fill in all fields");
    }
  
   
    const emailExists = await USER.findOne({ username });
    if (emailExists) {
      return res.status(400).send("Email already exists");
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newUser = new USER({
      name,
      username,
      password: hashedPassword,
      age,
      gender,
    });
  
    newUser
      .save()
      .then((user) => {
        res.status(201).redirect("/home");
      })
      .catch((err) => {
        next(err);
        // res.json(err.message)
      });
  });



 router.post("/login", async (req, res, next) => {
    console.log(req.body);
    const { username, password } = req.body;
    USER.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(404).json("Invalid User");
        }
  
        // Compare the provided password with the stored hashed password
        bcrypt
          .compare(password, user.password)
          .then((pass) => {
            if (pass) {
              // Generate a token
              const token = generateToken(user.id);
  
              // Set the token in a cookie
              res.cookie("token", token, {
                httpOnly: true, // Prevents client-side access to the cookie
                secure: process.env.NODE_ENV === "production", // Use HTTPS in production for security
                expires: new Date(Date.now() + 3600000 * 48), // 2d  expiration
                sameSite: "Strict", // Adjust as needed
              });
  
              // Send the user info back as
              req.user = user;
             
              res.status(200).redirect("/home");
            } else {
              res.status(400).send("Password error");
            }
          })
          .catch((err) => {
            console.log(err);
            next(err);
            //  res.status(500).json("Server error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json("Invalid User");
      });
  });


  const generateToken = (id) => {
    return jwt.sign({ id }, "aditya_printer_serete_key", { expiresIn: "2d" });
  };


 router.get("/logout", (req, res, next) => {
    // Clear the token cookie on logout
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensures it's cleared securely in production
        sameSite: "Strict", // Same Site attribute should match what was set
      });
  
      // Optionally, you can send a success message or redirect to a login page
      res.status(200).redirect("/user/reg"); // Redirect to the login page or send a success message
    } catch (e) {
      next(e);
    }
  });
// Use CommonJS export
module.exports = router;