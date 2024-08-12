const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tours },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  if (!tour)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });

  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tour },
  });
});

app.post("/api/v1/tours", (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
