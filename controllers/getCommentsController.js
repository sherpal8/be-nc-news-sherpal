const { retrieveComments } = require("../models/retrieveCommentsModel");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  retrieveComments(article_id, sort_by, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};
