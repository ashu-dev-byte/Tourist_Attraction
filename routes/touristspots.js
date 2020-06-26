const express = require("express");
const router = express.Router();
const tspot = require("../models/tspot");

//Get All Exploration Points
router.get("/", (req, res) => {
  tspot.find({}, (err, allTSpots) => {
    if (err) {
      console.log("Some error occured while traversing database!");
    } else {
      res.render("touristspots/index", { tspots: allTSpots });
    }
  });
});

//Add Exploration Points
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

//Show Form to Add Exploration Point
router.get("/new", isLoggedIn, (req, res) => {
  res.render("touristspots/newSpot");
});

//Find and Render Specific Exploration Point
router.get("/:id", (req, res) => {
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

//Show to Edit Specific Exploration Point
router.get("/:id/edit", checkExpoPointOwnership, (req, res) => {
  tspot.findById(req.params.id, (err, foundSpot) => {
    res.render("touristspots/edit", { foundSpot: foundSpot });
  });
});

//Update a Specific Exploration Point
router.put("/:id", checkExpoPointOwnership, (req, res) => {
  tspot.findByIdAndUpdate(req.params.id, req.body.spot, (err, updatedSpot) => {
    if (err) {
      console.log("Error while updating Explorating Point!!");
      res.redirect("/touristspots");
    } else {
      console.log("Successfully updated Explorating Point!!");
      res.redirect("/touristspots/" + req.params.id);
    }
  });
});

//Delete a Specific Exploration Point
router.delete("/:id", checkExpoPointOwnership, (req, res) => {
  tspot.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/touristspots");
    } else {
      res.redirect("/touristspots");
    }
  });
});

function checkExpoPointOwnership(req, res, next) {
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
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
