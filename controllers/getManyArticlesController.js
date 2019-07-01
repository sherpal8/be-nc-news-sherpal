const { fetchArticle } = require("../models/fetchArticleModel");

exports.getManyArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchArticle(sort_by, order, author, topic)
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ articles });
    })
    .catch(next);
};
