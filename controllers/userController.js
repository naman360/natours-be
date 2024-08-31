const fs = require("fs");
const Users = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    return res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: { users },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await Users.findByIdAndDelete(userId);
    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const userBody = req.body;
    const newUser = await Users.create(userBody);
    return res.status(201).json({
      status: "success",
      data: { tour: newUser },
    });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error });
  }
};
