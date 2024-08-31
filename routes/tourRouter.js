const express = require("express");
const {
  getAllTours,
  getTourById,
  deleteTour,
  updateTour,
  createTour,
} = require("../controllers/tourController");

const tourRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
