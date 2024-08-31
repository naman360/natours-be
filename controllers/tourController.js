const fs = require("fs");
const Tours = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    /* Filtering */
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    /* Advanced filtering using operators */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tours.find(JSON.parse(queryStr));

    /* Sorting */
    query = query.sort(req.query.sort || "createdAt");

    /* Fields Limiting */
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }

    const tours = await query;
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
