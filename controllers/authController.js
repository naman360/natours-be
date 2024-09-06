const Users = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await Users.create(req.body);

  res.status(201).json({
    status: "success",
    user: {
      newUser,
    },
  });
});
