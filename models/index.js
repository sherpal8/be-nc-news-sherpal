const connection = require("../connection");

exports.fetchTopics = () => {
  return connection.select("*").from("topics");
};

exports.fetchUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

exports.fetchArticle = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id });
};

exports.fetchCommentsList = article_id => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes)
    .into("articles")
    .where({ article_id })
    .returning("*");
};
