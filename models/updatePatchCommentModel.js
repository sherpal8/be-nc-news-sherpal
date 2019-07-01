const connection = require("../connection");

exports.updatePatchComment = (comment_id, inc_votes = 0) => {
  return connection
    .increment("votes", inc_votes)
    .into("comments")
    .where({ comment_id })
    .returning("*");
};
