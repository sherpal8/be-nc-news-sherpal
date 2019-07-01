const connection = require("../connection");

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
