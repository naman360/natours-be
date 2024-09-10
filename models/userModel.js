const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
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
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm the password"],
    /* Only works on create() and save() */
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords does not match!",
    },
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePassword = function (candidatePass, userPass) {
  return bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  console.log(this.passwordChangedAt, JWTTimestamp);
  if (this.passwordChangedAt) {
    const changedPassTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedPassTime;
  }
  return false;
};

const Users = mongoose.model("User", userSchema);
module.exports = Users;
