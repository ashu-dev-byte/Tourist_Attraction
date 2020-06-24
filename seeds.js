const comment = require("./models/comment");
const tspot = require("./models/tspot");
const data = require("./seedData");
// const mongoose = require("mongoose");
// const cmt = {
//   text: "This place is awesome. I always visit here in summers!!",
//   author: "Ironman",
// };

function seedDB() {
  tspot.deleteMany({}, (err) => {
    if (err) {
      console.log("Error occured while emptying database!");
    } else {
      console.log("Database removed!");
      data.forEach((seed) => {
        tspot.create(seed, (err, datum) => {
          if (err) {
            console.log("Error while seeding database!");
          } else {
            console.log("Added a exploration point");

            // comment.create(cmt, (err, com) => {
            //   if (err) {
            //     console.log("Error while seeding comment!");
            //   } else {
            //     datum.comments.push(com);
            //     datum.save();
            //     console.log("Added a comment!");
            //     //console.log(datum);
            //   }
            // });
          }
        });
      });
      console.log("Adding Database...");
    }
  });
}

module.exports = seedDB;
