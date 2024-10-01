const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/error-handler");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
