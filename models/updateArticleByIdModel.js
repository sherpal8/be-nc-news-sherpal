const connection = require("../connection");

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return connection
    .increment("votes", inc_votes)
    .into("articles")
    .where({ article_id })
    .returning("*");
};
