const connection = require("../connection");

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
  const orderByOptions = ["asc", "desc"];

  const sortOption = sortByOptions.includes(sort_by) ? sort_by : "created_at";
  const orderOption = orderByOptions.includes(order) ? order : "desc";

  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comments.article_id" })
    .groupBy("articles.article_id")
    .orderBy(sortOption, orderOption)
    .modify(query => {
      if (article_id) query.where({ "articles.article_id": article_id });
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    });
};
