const commentDB = require("../models/comment");
const tspot = require("../models/tspot");
let middlewareObject = {};

// For Checking Ownership of Exploration Points
middlewareObject.checkExpoPointOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    tspot.findById(req.params.id, (err, foundSpot) => {
      if (err) {
        console.log("Error while showing Edit Explorating Point Page!!");
        res.redirect("/touristspots");
      } else {
        if (foundSpot.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.send("<h1>You don't have that authorization!</h1>");
        }
      }
    });
  } else {
    res.send("<h1>You must be logged in before doing so!</h1>");
  }
};

// For Checking Ownership of Comments
middlewareObject.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    commentDB.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log("Error while showing Edit Explorating Point Page!!");
        res.redirect("/touristspots");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.send("<h1>You don't have that authorization!</h1>");
        }
      }
    });
  } else {
    res.send("<h1>You must be logged in before doing so!</h1>");
  }
};

//For Checking if user is logged in or not
middlewareObject.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObject;
