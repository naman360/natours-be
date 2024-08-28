const express = require("express");
const {
  getAllTours,
  getTourById,
  deleteTour,
  updateTour,
  createTour,
  checkId,
} = require("../controllers/tourController");

const tourRouter = express.Router();

tourRouter.param("id", checkId);

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
