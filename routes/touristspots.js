const express = require("express");
const router = express.Router();
const tspot = require("../models/tspot");

router.get("/", isLoggedIn, (req, res) => {
  tspot.find({}, (err, allTSpots) => {
    if (err) {
      console.log("Some error occured while traversing database!");
    } else {
      res.render("touristspots/index", { tspots: allTSpots });
    }
  });
});

router.post("/", isLoggedIn, (req, res) => {
  let name = req.body.name;
  let city = req.body.city;
  let imageURL = req.body.imageURL;
  let description = req.sanitize(req.body.description);
  var author = {
    username: req.user.username,
    id: req.user._id,
  };
  let newSpot = {
    name: name,
    city: city,
    imageURL: imageURL,
    description: description,
    author: author,
  };

  tspot.create(newSpot, isLoggedIn, (err, newTSpot) => {
    if (err) {
      console.log("Some error occured while adding newTSpot to database!");
    } else {
      console.log("New Tourist Spot saved to database.");
      //console.log(newTSpot);
    }
  });
  res.redirect("/touristspots");
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("touristspots/newSpot");
});

router.get("/:id", isLoggedIn, (req, res) => {
  tspot
    .findById(req.params.id)
    .populate("comments")
    .exec((err, specificSpot) => {
      if (err) {
        console.log("Some error occured while showing this tSpot.\n" + err);
        console.log(specificSpot);
      } else {
        console.log("Rendered this tSpot.\n");
        //console.log(specificSpot);
        res.render("touristspots/show", { specificSpot: specificSpot });
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
