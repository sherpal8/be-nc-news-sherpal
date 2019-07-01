const connection = require("../connection");

exports.removeContent = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .delete();
};
