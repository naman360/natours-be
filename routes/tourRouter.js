const express = require("express");
const {
  getAllTours,
  getTourById,
  deleteTour,
  updateTour,
  createTour,
  getStats,
  getMonthlyPlan,
} = require("../controllers/tourController");

const tourRouter = express.Router();

tourRouter.route("/stats").get(getStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
