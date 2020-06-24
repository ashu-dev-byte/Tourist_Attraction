const express = require("express");
const router = express.Router({ mergeParams: true });
const tspot = require("../models/tspot");
const commentDB = require("../models/comment");

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
      let datum = {
        text: req.sanitize(req.body.commentText),
        author: {
          username: req.user.username,
          id: req.user._id,
        },
      };

      commentDB.create(datum, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          foundTspot.comments.push(comment);
          foundTspot.save();
          // console.log(comment);
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
