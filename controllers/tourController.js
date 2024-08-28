const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours.json`));

exports.checkId = (req, res, next, val) => {
  if (val * 1 > tours.length)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tours },
  });
};

exports.getTourById = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tour },
  });
};

exports.updateTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  res.status(200).json({
    status: "success",
    data: tour,
  });
};

exports.deleteTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  res.status(200).json({
    status: "success",
    data: null,
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    name: req.body.name,
    duration: req.body.duration,
    location: req.body.location,
    price: req.body.price,
  };
  tours.push(newTour);

  fs.writeFile("${__dirname}/data/tours.json", JSON.stringify(tours), (err) =>
    res.status(201).json({
      status: "success",
      totalTours: tours.length,
      data: { tour: newTour },
    })
  );
};
