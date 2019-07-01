const endpointsData = require("../endpoints.json");

exports.getJSON = (req, res, next) => {
  res.status(200).send({ endpointsData });
};
