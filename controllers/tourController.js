const Tours = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tours.findById(tourId);

  if (!tour) {
    return next(new AppError("Can't find tour with the specified ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: { tour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tours.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("Can't find tour with the specified ID", 404));
  }
  return res.status(200).json({
    status: "success",
    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  if (!tourId) {
    return next(new AppError("Can't find tour with the specified ID", 404));
  }
  await Tours.findByIdAndDelete(tourId);
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tourBody = req.body;
  const newTour = await Tours.create(tourBody);
  return res.status(201).json({
    status: "success",
    data: { tour: newTour },
  });
});

exports.getStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
