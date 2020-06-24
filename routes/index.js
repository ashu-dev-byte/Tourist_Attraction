const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../models/user");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const newUser = new user({ username: req.body.username });
  user.register(newUser, req.body.password, (err, createdUser) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, () => {
      console.log(createdUser);
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/touristspots",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/touristspots");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
