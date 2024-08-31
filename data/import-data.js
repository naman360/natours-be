const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tours = require("../models/tourModel");

dotenv.config({ path: "./.env" });
const db = process.env.DB_PROD?.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("Database Connected!");
  });

//   Read from JSON file
const importDataFromJSONToDB = () => {
  fs.readFile(`${__dirname}/tours.json`, async (err, data) => {
    await Tours.create(JSON.parse(data));
    console.log("Data imported in DB!");
    process.exit();
  });
};

const deleteDB = async () => {
  await Tours.deleteMany();
  console.log("Data deleted from DB!");
  process.exit();
};

switch (process.argv[2]) {
  case "--import":
    importDataFromJSONToDB();
    break;
  case "--delete":
    deleteDB();
    break;
}
