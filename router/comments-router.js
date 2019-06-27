const express = require("express");
const commentsRouter = express.Router();
const { patchComment, deleteComment } = require("../controllers");
const { errorHandler405 } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(errorHandler405);

module.exports = { commentsRouter };
