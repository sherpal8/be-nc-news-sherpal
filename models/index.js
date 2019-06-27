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

exports.fetchArticle = (article_id, sort_by, order, author, topic) => {
  const sortByOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count"
  ];
  const orderOptions = ["asc", "desc"];
  let sortOption = "created_at";
  let orderOption = "asc";
  if (sortByOptions.includes(sort_by)) {
    sortOption = sort_by;
  }
  if (orderOptions.includes(order)) {
    orderOption = order;
  }
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .orderBy(sortOption, orderOption)
    .modify(query => {
      if (article_id) query.where({ "articles.article_id": article_id });
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes)
    .into("articles")
    .where({ article_id })
    .returning("*");
};

exports.createComment = (article_id, username, body) => {
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

exports.updatePatchComment = (comment_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes)
    .into("comments")
    .where({ comment_id })
    .returning("*");
};
