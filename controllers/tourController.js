const fs = require("fs");
const Tours = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tours.find();
    return res.status(200).json({
      status: "success",
      totalTours: tours.length,
      data: { tours },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tours.findById(tourId);
    return res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tours.findByIdAndUpdate(tourId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tours.findByIdAndDelete(tourId);
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

exports.createTour = async (req, res) => {
  try {
    const tourBody = req.body;
    const newTour = await Tours.create(tourBody);
    return res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error });
  }
};
