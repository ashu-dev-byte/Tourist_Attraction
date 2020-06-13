const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

let tspots = [
  {
    name: "Patna Museum",
    imageURL:
      "https://4.bp.blogspot.com/-tM6rL9-Uixk/Vth3RRpaghI/AAAAAAAAA2w/TXdmfCvbePg/s1600/patna-museum-hd-wallpaper-image.jpg",
  },
  {
    name: "Gandhi Maidan",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/en/b/b4/Gandhi_Maidan.jpg",
  },
  {
    name: "Patna Zoo",
    imageURL:
      "https://www.travelbaits.in/wp-content/uploads/2019/08/Travelbaits_Patna-Zoo-600x450.jpeg?p=2318",
  },
  {
    name: "Energy Park",
    imageURL:
      "https://scontent.fccu17-1.fna.fbcdn.net/v/t1.0-9/16806802_1852573335032354_7931790811273432280_n.jpg?_nc_cat=107&_nc_sid=09cbfe&_nc_ohc=Wr_I9aEJkHsAX9mvbhA&_nc_ht=scontent.fccu17-1.fna&oh=ed00dc65445cfcd2007a9f145a9d9a1e&oe=5F09359A",
  },
];

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/touristspots", (req, res) => {
  res.render("touristspots", { tspots: tspots });
});

app.post("/touristspots", (req, res) => {
  let name = req.body.name;
  let imageURL = req.body.imageURL;
  let newSpot = { name: name, imageURL: imageURL };
  tspots.push(newSpot);
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
