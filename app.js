const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const passport = require("passport");
const comment = require("./models/comment");
const tspot = require("./models/tspot");
const user = require("./models/user");
const mongoose = require("mongoose");
const seedDB = require("./seeds");
const express = require("express");
const app = express();

const touristspotsRoutes = require("./routes/touristspots");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
const { text } = require("express");

mongoose.connect("mongodb://localhost/touristSpots");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
//seedDB();

// ====================Passport Configuration====================
app.use(
  require("express-session")({
    secret: "One day, Luffy will become the Pirate King!!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// ==========================END===================================

app.use("/", indexRoutes);
app.use("/touristspots", touristspotsRoutes);
app.use("/touristspots/:id/comments", commentRoutes);

app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(3000, () => {
  console.log("The server has started at port 3000.");
});
