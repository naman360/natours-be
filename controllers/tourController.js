const fs = require("fs");
const Tours = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tours.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const tours = await features.query;

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
    await Tours.findByIdAndDelete(tourId);
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

exports.getStats = async (req, res) => {
  try {
    const stats = await Tours.aggregate([
      {
        $match: { rating: { $gte: 4.6 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
      {
        $sort: {
          averageRating: 1, // 1 for ascending
        },
      },
      { $match: { _id: { $ne: "EASY" } } },
    ]);
    return res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tours.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numPlans: { $sum: 1 },
          tours: { $push: { name: "$name", rating: "$rating" } },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { numPlans: 1 } },
    ]);
    return res.status(200).json({
      status: "success",
      data: { plan },
    });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error });
  }
};
