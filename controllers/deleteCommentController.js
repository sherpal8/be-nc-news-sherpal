const { removeContent } = require("../models/removeContentModel");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeContent(comment_id)
    .then(deleteCount => {
      if (deleteCount === 0) {
        return Promise.reject({ status: "404", msg: "Page not found" });
      }
      res.status(204).send();
    })
    .catch(next);
};
