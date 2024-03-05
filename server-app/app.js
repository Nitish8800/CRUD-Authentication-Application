const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { errors: celebrateErrors } = require("celebrate");

/**
 * All express middleware goes here
 * `express.json()` = parsing request body
 * `bearerToken` = For `Basic Auth` token
 */
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/**
 * cors => cross origin resource sharing
 */
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

dotenv.config({
  path: path.join(__dirname, ".env"),
});

/**
 * Handaling database connection
 * In this application we are using only MongoDB with helper lib `mongoose`
 */
connectDB();

/**
 * Initializing APIs base routes.
 * APIs base path also depends on server proxy configuration.
 */
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server App is working ....................... ",
  });
});

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

/**
 * Handaling All Validations Error with helper lib `celebrate` and "joi"
 */
app.use(celebrateErrors());

/**
 * Connect the PORT
 * Server started at port
 */
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at port: http://localhost:${PORT}`);
});
