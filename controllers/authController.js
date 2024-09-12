const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Users = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.AUTH_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    user: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide an email and password", 400));

  const user = await Users.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  return res.status(200).json({
    status: "success",
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("You are not logged in!", 401));
  const decoded = await promisify(jwt.verify)(token, process.env.AUTH_SECRET);
  const freshUser = await Users.findById(decoded.id);

  if (!freshUser)
    return next(
      new AppError("The user belonging to this user does not exists", 401)
    );

  if (freshUser.isPasswordChanged(decoded.iat)) {
    return next(new AppError("User recently changed the password"));
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have persmission to perform this action", 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("The user does not exists", 404));
  }
  const resetToken = user.createResetPasswordToken();
  /**
   *  Useful because we modified the document properties, and the document will only update after save.
   * Using validateBeforeSave to avoid validation as user model has required fields.
   */
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot your password? Submmit a patch request with your new password and confirmPasword to: ${resetUrl}.\n`;

  try {
    sendEmail({
      message,
      email: user.email,
      subject: "Reset Password Token",
    });
    res.status(200).json({ status: "success", messgae: "Token send to email" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an issue sending email!", 500));
  }
});

exports.resetPassword = (req, res, next) => {};
