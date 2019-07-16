const { fetchArticle } = require("../models/fetchArticleModel");

exports.getArticle = (req, res, next) => {
  const { article_id, sort_by, order, author, topic } = req.params;
  fetchArticle(article_id, sort_by, order, author, topic)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
