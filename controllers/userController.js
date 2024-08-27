const fs = require("fs");

const users = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.json`));
exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    totalTours: users.length,
    data: { users },
  });
};

exports.getUserById = (req, res) => {
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

exports.updateUser = (req, res) => {
  const userId = req.params.id * 1;
  const user = users.find((user) => user.id === userId);

  if (!user)
    return res.status(404).json({ status: "fail", message: "Invalid user ID" });

  res.status(200).json({
    status: "success",
    data: user,
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id * 1;
  const user = users.find((user) => user.id === userId);

  if (!user)
    return res.status(404).json({ status: "fail", message: "Invalid user ID" });

  res.status(200).json({
    status: "success",
    data: null,
  });
};

exports.createUser = (req, res) => {
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
