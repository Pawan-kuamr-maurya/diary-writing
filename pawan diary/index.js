const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const { convert } = require("html-to-text");


const options = {wordwrap: 130,};

const app = express();

//const user=require("./routes/users")
const USER = require("./models/User.js");
const Post = require("./models/Post.js");
const isathenticate = require("./isvaliduser/Authentication.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { log } = require("console");
app.use(cookieParser());

let userroute=require("./routes/users.js")
let homepostrout =require("./routes/home.js")
let post=require("./routes/post.js")


app.get("/",(req,res)=>{
  res.render("pages/landingpage.ejs")
})
app.use("/user",userroute);
app.use("/home",homepostrout);
app.use("/post",post);



app.use((req, res, next) => {
  res.render("pages/error.ejs", {
    main: "page not found",
    solution: 'For  any help <a href="/home/contact">cleack here</a>',
  });
});

// Express error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.render("pages/error.ejs", { main: err.message, solution: err.stack });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/adityacaskend")
  .then(() =>
    app.listen(3000,'0.0.0.0',() => console.log(`server running on port ${3000}`))
  )
  .catch((err) => console.log(err.message));
