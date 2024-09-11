const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const authController = require("../controllers/authController");
const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/forgot-password", authController.forgotPassword);
userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
module.exports = userRouter;
