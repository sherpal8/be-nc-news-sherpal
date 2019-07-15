const express = require("express");
const app = express();
app.use(cors());
const { apiRouter } = require("./router/api-router");

const {
  errorHandler400,
  errorHandler422,
  errorHandler404,
  errorHandler500,
  errorHandler405
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "Page does not exist" });
});

app.use(errorHandler400);
app.use(errorHandler422);
app.use(errorHandler404);
app.use(errorHandler500);
app.use(errorHandler405);

module.exports = { app };
