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
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .modify(query => {
      if (article_id) query.where({ "articles.article_id": article_id });
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes)
    .into("articles")
    .where({ article_id })
    .returning("*");
};
