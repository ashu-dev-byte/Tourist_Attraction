const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../middleware/index");
const commentDB = require("../models/comment");
const tspot = require("../models/tspot");

//Show Add comment page
router.get("/new", middleware.isLoggedIn, (req, res) => {
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

//Add comment
router.post("/", middleware.isLoggedIn, (req, res) => {
  tspot.findById(req.params.id, (err, foundTspot) => {
    if (err) {
      console.log("Error while adding comment!" + err);
      res.redirect("/touristspots/:id");
    } else {
      let datum = {
        text: req.sanitize(req.body.commentText),
        author: {
          username: req.user.username,
          id: req.user._id,
        },
      };

      commentDB.create(datum, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          foundTspot.comments.push(comment);
          foundTspot.save();
          // console.log(comment);
          res.redirect(`/touristspots/${foundTspot._id}`);
        }
      });
    }
  });
});

//Show Edit comment page
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    tspot.findById(req.params.id, (err, specificSpot) => {
      commentDB.findById(req.params.comment_id, (err, gotComment) => {
        if (err) {
          console.log(err);
        } else {
          res.render("comments/edit", {
            specificSpot: specificSpot,
            gotComment: gotComment,
          });
        }
      });
    });
  }
);

//Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  commentDB.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, gotComment) => {
      if (err) {
        console.log("Error while updating Explorating Point!!");
        res.redirect("back");
      } else {
        console.log("Successfully updated Explorating Point!!");
        res.redirect("/touristspots/" + req.params.id);
      }
    }
  );
});

//Delete a Specific Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  commentDB.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("/touristspots/" + req.params.id);
    } else {
      res.redirect("/touristspots/" + req.params.id);
    }
  });
});

module.exports = router;
