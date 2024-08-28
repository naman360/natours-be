const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  checkId,
} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.param("id", checkId);
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
module.exports = userRouter;
