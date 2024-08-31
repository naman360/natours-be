const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  price: { type: Number, required: true },
  description: { type: String, required: true },
  rating: Number,
  createdAt: { type: Date, default: Date.now() },
});

const Tours = mongoose.model("Tour", tourSchema);
module.exports = Tours;
