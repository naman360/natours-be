const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: Number, required: true },
  address: {
    city: String,
    state: String,
  },
});

const Tour = mongoose.model("User", userSchema);
module.exports = Tour;
