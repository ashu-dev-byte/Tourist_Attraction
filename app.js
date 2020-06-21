const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const passport = require("passport");
const comment = require("./models/comment");
const tspot = require("./models/tspot");
const user = require("./models/user");
const mongoose = require("mongoose");
const express = require("express");
const seedDB = require("./seeds");
const { use, Authenticator } = require("passport");
const app = express();

mongoose.connect("mongodb://localhost/touristSpots");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// Passport Configuration====================
app.use(
  require("express-session")({
    secret: "One day, Luffy will become the Pirate King!!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// END========================================

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/touristspots", isLoggedIn, (req, res) => {
  tspot.find({}, (err, allTSpots) => {
    if (err) {
      console.log("Some error occured while traversing database!");
    } else {
      res.render("touristspots/index", { tspots: allTSpots });
    }
  });
});

app.post("/touristspots", isLoggedIn, (req, res) => {
  let name = req.body.name;
  let city = req.body.city;
  let imageURL = req.body.imageURL;
  let description = req.sanitize(req.body.description);
  let newSpot = {
    name: name,
    city: city,
    imageURL: imageURL,
    description: description,
  };

  tspot.create(newSpot, isLoggedIn, (err, newTSpot) => {
    if (err) {
      console.log("Some error occured while adding newTSpot to database!");
    } else {
      console.log("New Tourist Spot saved to database.");
      console.log(newTSpot);
    }
  });
  res.redirect("/touristspots");
});

app.get("/touristspots/new", isLoggedIn, (req, res) => {
  res.render("touristspots/newSpot");
});

app.get("/touristspots/:id", isLoggedIn, (req, res) => {
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

app.get("/touristspots/:id/comments/new", isLoggedIn, (req, res) => {
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

app.post("/touristspots/:id/comments", isLoggedIn, (req, res) => {
  tspot.findById(req.params.id, (err, foundTspot) => {
    if (err) {
      console.log("Error while adding comment!" + err);
      res.redirect("/touristspots/:id");
    } else {
      req.body.comment.text = req.sanitize(req.body.comment.text);
      req.body.comment.author = res.locals.currentUser.username;
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

// Authentication Routes====================================
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new user({ username: req.body.username });
  user.register(newUser, req.body.password, (err, createdUser) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, () => {
      console.log(createdUser);
      res.redirect("/");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/touristspots",
    failureRedirect: "/",
  }),
  (req, res) => {}
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/touristspots");
});

app.get("*", (req, res) => {
  res.send("<h3>This root has not been defined</h3>");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
  console.log("The server has started at port 3000.");
});
