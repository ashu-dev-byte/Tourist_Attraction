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
      req.flash("error", err.message);
      return res.redirect("/register");
    }

    passport.authenticate("local")(req, res, () => {
      console.log(createdUser);
      req.flash(
        "success",
        "Welcome to Traveller's Paradise, " + createdUser.username
      );
      res.redirect("/touristspots");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/touristspots/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Logged out successfully.");
  res.redirect("/touristspots");
});

module.exports = router;
