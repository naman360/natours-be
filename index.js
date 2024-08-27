const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(morgan("dev"));
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tours },
  });
};

const getTourById = (req, res) => {
  const userId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  if (!tour)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });

  res.status(200).json({
    status: "success",
    totalTours: tours.length,
    data: { tour },
  });
};

const updateTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  if (!tour)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });

  res.status(200).json({
    status: "success",
    data: tour,
  });
};

const deleteTour = (req, res) => {
  const tourId = req.params.id * 1;
  const tour = tours.find((tour) => tour.id === tourId);

  if (!tour)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });

  res.status(200).json({
    status: "success",
    data: null,
  });
};

const createTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    totalTours: users.length,
    data: { users },
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id * 1;
  const user = users.find((user) => user.id === userId);

  if (!user)
    return res.status(404).json({ status: "fail", message: "Invalid tour ID" });

  res.status(200).json({
    status: "success",
    totalUser: users.length,
    data: { user },
  });
};

const updateUser = (req, res) => {
  const userId = req.params.id * 1;
  const user = users.find((user) => user.id === userId);

  if (!user)
    return res.status(404).json({ status: "fail", message: "Invalid user ID" });

  res.status(200).json({
    status: "success",
    data: user,
  });
};

const deleteUser = (req, res) => {
  const userId = req.params.id * 1;
  const user = users.find((user) => user.id === userId);

  if (!user)
    return res.status(404).json({ status: "fail", message: "Invalid user ID" });

  res.status(200).json({
    status: "success",
    data: null,
  });
};

const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = {
    id: newId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      state: req.body.address.state,
      zip: req.body.address.zip,
    },
    dateOfBirth: req.body.dateOfBirth,
  };

  users.push(newUser);

  fs.writeFile("${__dirname}/data/users.json", JSON.stringify(users), (err) =>
    res.status(201).json({
      status: "success",
      totalUsers: users.length,
      data: { users: newUser },
    })
  );
};

const tourRouter = express.Router();
const userRouter = express.Router();

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
