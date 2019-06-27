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

exports.updateComments = (article_id, username, body) => {
  const objData = {
    author: username,
    body
  };
  return connection
    .update(objData)
    .into("comments")
    .where({ article_id })
    .returning("*");
};

exports.retrieveComments = (article_id, sort_by, order) => {
  const validSortBys = ["comment_id", "votes", "created_at", "author", "body"];
  const validOrderCriteria = ["asc", "desc"];
  let sortCriteria = "created_at";
  let orderCriteria = "desc";
  if (validSortBys.includes(sort_by)) {
    sortCriteria = sort_by;
  }
  if (validOrderCriteria.includes(order)) {
    orderCriteria = order;
  }

  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where({ article_id })
    .orderBy(sortCriteria, orderCriteria);
};
