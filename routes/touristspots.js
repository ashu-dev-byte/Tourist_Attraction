const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
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

//Show Form to Add Exploration Point
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("touristspots/newSpot");
});

//Add Exploration Points
router.post("/", middleware.isLoggedIn, (req, res) => {
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

  tspot.create(newSpot, middleware.isLoggedIn, (err, newTSpot) => {
    if (err) {
      console.log("Some error occured while adding newTSpot to database!");
    } else {
      console.log("New Tourist Spot saved to database.");
      //console.log(newTSpot);
    }
  });
  req.flash("success", "Added Exploration Point.");
  res.redirect("/touristspots");
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

//Show Form to Edit Specific Exploration Point
router.get("/:id/edit", middleware.checkExpoPointOwnership, (req, res) => {
  tspot.findById(req.params.id, (err, foundSpot) => {
    res.render("touristspots/edit", { foundSpot: foundSpot });
  });
});

//Update a Specific Exploration Point
router.put("/:id", middleware.checkExpoPointOwnership, (req, res) => {
  tspot.findByIdAndUpdate(req.params.id, req.body.spot, (err, updatedSpot) => {
    if (err) {
      console.log("Error while updating Explorating Point!!");
      res.redirect("/touristspots");
    } else {
      console.log("Successfully updated Explorating Point!!");
      req.flash("success", "Updated Exploration Point.");
      res.redirect("/touristspots/" + req.params.id);
    }
  });
});

//Delete a Specific Exploration Point
router.delete("/:id", middleware.checkExpoPointOwnership, (req, res) => {
  tspot.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/touristspots");
    } else {
      req.flash("success", "Deleted Exploration Point.");
      res.redirect("/touristspots");
    }
  });
});

module.exports = router;
