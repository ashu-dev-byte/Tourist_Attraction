const commentDB = require("../models/comment");
const tspot = require("../models/tspot");
let middlewareObject = {};

// For Checking Ownership of Exploration Points
middlewareObject.checkExpoPointOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    tspot.findById(req.params.id, (err, foundSpot) => {
      if (err || !foundSpot) {
        console.log("Error while showing Edit Explorating Point Page!!");
        req.flash("error", "Exploration Point not found.");
        res.redirect("/touristspots");
      } else {
        if (foundSpot.author.id.equals(req.user._id)) {
          return next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("/touristspots/" + foundSpot._id);
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/touristspots/" + req.params.id);
  }
};

// For Checking Ownership of Comments
middlewareObject.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    tspot.findById(req.params.id, (err, foundSpot) => {
      if (err || !foundSpot) {
        console.log("Explorating Point not found!!");
        req.flash("error", "Exploration Point not found.");
        res.redirect("/touristspots");
      } else {
        commentDB.findById(req.params.comment_id, (err, foundComment) => {
          if (err || !foundComment) {
            console.log("Comment not found!!");
            req.flash("error", "Comment not found!");
            res.redirect("/touristSpots/" + foundSpot._id);
          } else {
            if (foundComment.author.id.equals(req.user._id)) {
              return next();
            } else {
              req.flash("error", "You don't have permission to do that.");
              res.redirect("/touristspots/" + foundSpot._id);
            }
          }
        });
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/touristspots/" + req.params.id);
  }
};

//For Checking if user is logged in or not
middlewareObject.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
};

middlewareObject.escapeRegex = function (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = middlewareObject;
