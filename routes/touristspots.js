const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");
const tspot = require("../models/tspot");

//Get All Exploration Points
router.get("/", function (req, res) {
  let perPage = 9;
  let pageQuery = parseInt(req.query.page);
  let pageNumber = pageQuery ? pageQuery : 1;
  let noMatch = null;
  let checkQuery = false;

  if (req.query.search) {
    // Refine the Exploration Points according to the query
    const regex = new RegExp(middleware.escapeRegex(req.query.search), "gi");
    checkQuery = true;

    tspot
      .find({ name: regex })
      .sort({ createdAt: -1 })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec((err, allTSpots) => {
        tspot.count({ name: regex }).exec((err, count) => {
          if (err) {
            console.log("Some error occured while traversing database!");
            res.redirect("back");
          } else {
            if (allTSpots.length < 1) {
              noMatch =
                "No Exploration Points match that query, please try again with some different names.";
            }
            res.render("touristspots/index", {
              tspots: allTSpots,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              checkQuery: checkQuery,
              search: req.query.search,
            });
          }
        });
      });
  } else {
    // Get all Exploration Points from DB
    tspot
      .find({})
      .sort({ createdAt: -1 })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, allTSpots) {
        tspot.count().exec((err, count) => {
          if (err) {
            console.log("Some error occured while traversing database!");
          } else {
            res.render("touristspots/index", {
              tspots: allTSpots,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              checkQuery: checkQuery,
              search: false,
            });
          }
        });
      });
  }
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
      console.log(newTSpot);
    }
  });
  req.flash("success", "Added Exploration Point.");
  res.redirect("/touristspots");
});

//Find and Render Specific Exploration Point
router.get("/:id", (req, res) => {
  tspot
    .findById(req.params.id)
    .populate({ path: "comments", options: { sort: { createdAt: -1 } } })
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
