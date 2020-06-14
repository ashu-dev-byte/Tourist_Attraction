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
  imageURL: String,
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
      res.render("touristspots", { tspots: allTSpots });
    }
  });
});

app.post("/touristspots", (req, res) => {
  let name = req.body.name;
  let imageURL = req.body.imageURL;
  let newSpot = { name: name, imageURL: imageURL };

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
  res.render("new");
});

app.get("*", (req, res) => {
  res.send("<h3>This root has not been defined</h3>");
});

app.listen(3000, () => {
  console.log("The server has started at port 3000.");
});
