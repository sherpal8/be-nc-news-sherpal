const express = require("express");
const articlesRouter = express.Router();
const { getArticle, patchArticle } = require("../controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle);

module.exports = { articlesRouter };
