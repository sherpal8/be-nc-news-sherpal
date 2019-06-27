const {
  fetchTopics,
  fetchUser,
  fetchArticle,
  updateArticleById,
  updateComments,
  retrieveComments
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
      if (!article) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

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

exports.patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  updateComments(article_id, username, body)
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: "404", msg: "Page does not exist" });
      }
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  retrieveComments(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
