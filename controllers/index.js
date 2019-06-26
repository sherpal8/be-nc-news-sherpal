const {
  fetchTopics,
  fetchUser,
  fetchArticle,
  updateArticleById
} = require("../models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      let endObject = {};
      endObject.topics = topics;
      res.status(200).send({ endObject });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  let { inc_votes } = req.body;
  let { article_id } = req.params;

  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
