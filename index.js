const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.status(400).json({ msg: "Express Setup" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
