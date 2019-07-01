const { fetchArticle } = require("../models/fetchArticleModel");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
