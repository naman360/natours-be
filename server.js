const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });
const db = process.env.DB_URI?.replace("<PASSWORD>", process.env.DB_PASSWORD);
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
