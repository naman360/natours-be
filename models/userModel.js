const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please tell us your name"] },
  email: {
    type: String,
    require: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm the password"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Users = mongoose.model("User", userSchema);
module.exports = Users;
