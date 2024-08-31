const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  address: {
    city: String,
    state: String,
    zip: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Users = mongoose.model("User", userSchema);
module.exports = Users;
