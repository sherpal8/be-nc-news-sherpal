const { retrieveJSON } = require("../models/retrieveJSONModel");

exports.getJSON = (req, res, next) => {
  const endpointsData = retrieveJSON();
  res.status(200).send({ endpointsData });
};
