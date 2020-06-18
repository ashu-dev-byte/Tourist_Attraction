const bodyParser = require("body-parser");
const comment = require("./models/comment");
const tspot = require("./models/tspot");
const mongoose = require("mongoose");
const express = require("express");
const seedDB = require("./seeds");
const app = express();

mongoose.connect("mongodb://localhost/touristSpots");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/touristspots", (req, res) => {
  tspot.find({}, (err, allTSpots) => {
    if (err) {
      console.log("Some error occured while traversing database!");
    } else {
      res.render("touristspots/index", { tspots: allTSpots });
    }
  });
});

app.post("/touristspots", (req, res) => {
  let name = req.body.name;
  let city = req.body.city;
  let imageURL = req.body.imageURL;
  let description = req.body.description;
  let newSpot = {
    name: name,
    city: city,
    imageURL: imageURL,
    description: description,
  };

  tspot.create(newSpot, (err, newTSpot) => {
    if (err) {
      console.log("Some error occured while adding newTSpot to database!");
    } else {
      console.log("New Tourist Spot saved to database.");
      console.log(newTSpot);
    }
  });
  res.redirect("/touristspots");
});

app.get("/touristspots/new", (req, res) => {
  res.render("touristspots/newSpot");
});

app.get("/touristspots/:id", (req, res) => {
  tspot
    .findById(req.params.id)
    .populate("comments")
    .exec((err, specificSpot) => {
      if (err) {
        console.log("Some error occured while showing this tSpot.\n" + err);
        console.log(specificSpot);
      } else {
        console.log("Rendered this tSpot.\n");
        console.log(specificSpot);
        res.render("touristspots/show", { specificSpot: specificSpot });
      }
    });
});

app.get("/touristspots/:id/comments/new", (req, res) => {
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

app.post("/touristspots/:id/comments", (req, res) => {
  tspot.findById(req.params.id, (err, foundTspot) => {
    if (err) {
      console.log("Error while adding comment!" + err);
      res.redirect("/touristspots/:id");
    } else {
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

app.get("*", (req, res) => {
  res.send("<h3>This root has not been defined</h3>");
});

app.listen(3000, () => {
  console.log("The server has started at port 3000.");
});
