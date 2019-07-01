const { fetchUser } = require("../models/fetchUserModel");

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
