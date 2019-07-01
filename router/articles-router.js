const express = require("express");
const articlesRouter = express.Router();
const { getArticle } = require("../controllers/getArticleController");
const { patchArticle } = require("../controllers/patchArticleController");
const { postComment } = require("../controllers/postCommentController");
const { getComments } = require("../controllers/getCommentsController");
const { getManyArticles } = require("../controllers/getManyArticlesController");
const { errorHandler405 } = require("../errors");

articlesRouter
  .route("/")
  .get(getManyArticles)
  .all(errorHandler405);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(errorHandler405);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(errorHandler405);

module.exports = { articlesRouter };
