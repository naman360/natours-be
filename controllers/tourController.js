const fs = require("fs");
const Tours = require("../models/tourModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    /* Advanced filtering using operators */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    this.query = this.query.sort(this.queryString.sort || "createdAt");
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }
  paginate() {
    const pageNo = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skipValue = (pageNo - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);
    return this;
  }
}

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
