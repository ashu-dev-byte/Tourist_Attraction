const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
mongoose.connect("mongodb://localhost/touristSpots");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const tspotSchema = new mongoose.Schema({
  name: String,
  city: String,
  imageURL: String,
  description: String,
});

const tspot = mongoose.model("tspot", tspotSchema);

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/touristspots", (req, res) => {
  tspot.find({}, (err, allTSpots) => {
    if (err) {
      console.log("Some error occured while traversing database!");
    } else {
      res.render("index", { tspots: allTSpots });
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
  res.render("newSpot");
});

app.get("/touristspots/:id", (req, res) => {
  tspot.findById(req.params.id, (err, specificSpot) => {
    if (err) {
      console.log("Some error occured while showing this tSpot.");
    } else {
      res.render("show", { specificSpot: specificSpot });
    }
  });
});

app.get("*", (req, res) => {
  res.send("<h3>This root has not been defined</h3>");
});

app.listen(3000, () => {
  console.log("The server has started at port 3000.");
});
