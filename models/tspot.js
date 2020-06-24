var mongoose = require("mongoose");

const tspotSchema = new mongoose.Schema({
  name: String,
  city: String,
  imageURL: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

const tspot = mongoose.model("tspot", tspotSchema);

module.exports = tspot;
