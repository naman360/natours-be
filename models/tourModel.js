const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: Number,
});

const Tour = mongoose.model("User", tourSchema);
module.exports = Tour;
