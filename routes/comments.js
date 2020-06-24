const express = require("express");
const router = express.Router({ mergeParams: true });
const tspot = require("../models/tspot");
const comment = require("../models/comment");

router.get("/new", isLoggedIn, (req, res) => {
  tspot.findById(req.params.id, (err, foundTspot) => {
    if (err) {
      console.log("Error while showing add comment page!" + err);
    } else {
      tspot.findById(req.params.id, (err, foundTspot) => {
        res.render("comments/new", { specificSpot: foundTspot });
      });
    }
  });
});

router.post("/", isLoggedIn, (req, res) => {
  tspot.findById(req.params.id, (err, foundTspot) => {
    if (err) {
      console.log("Error while adding comment!" + err);
      res.redirect("/touristspots/:id");
    } else {
      req.body.comment.text = req.sanitize(req.body.comment.text);
      req.body.comment.author = res.locals.currentUser.username;
      comment.create(req.body.comment, (err, com) => {
        if (err) {
          console.log(err);
        } else {
          foundTspot.comments.push(com);
          foundTspot.save();
          res.redirect(`/touristspots/${foundTspot._id}`);
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
