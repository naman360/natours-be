const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

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

/** Useful for using projections (select: false) in model */
mongoose.set("toObject", { useProjection: true });
mongoose.set("toJSON", { useProjection: true });
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
