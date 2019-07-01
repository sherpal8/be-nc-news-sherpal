const { updatePatchComment } = require("../models/updatePatchCommentModel");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updatePatchComment(comment_id, inc_votes)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ comment });
    })
    .catch(next);
};
