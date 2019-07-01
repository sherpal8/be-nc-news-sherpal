const express = require("express");
const apiRouter = express.Router();
const { topicsRouter } = require("./topics-router");
const { usersRouter } = require("./users-router");
const { articlesRouter } = require("./articles-router");
const { commentsRouter } = require("./comments-router");
const { getJSON } = require("../controllers");
const { errorHandler405 } = require("../errors");

apiRouter
  .route("/")
  .get(getJSON.getJSON)
  .all(errorHandler405);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = { apiRouter };
