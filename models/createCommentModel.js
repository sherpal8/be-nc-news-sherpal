const connection = require("../connection");

exports.createComment = (article_id, username, body) => {
  const objData = {
    author: username,
    body,
    article_id
  };
  return connection
    .insert(objData)
    .into("comments")
    .where({ article_id })
    .returning("*");
};
