exports.errorHandler400 = (err, req, res, next) => {
  const codes = ["22P02", "42703", "23502"];
  if (codes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.errorHandler422 = (err, req, res, next) => {
  const codes = ["23503"];
  if (codes.includes(err.code)) {
    res.status(422).send({ msg: "Unprocessable entity" });
  } else {
    next(err);
  }
};

exports.errorHandler404 = (err, req, res, next) => {
  const codes = ["404"];
  if (codes.includes(err.code) || codes.includes(err.status)) {
    res.status(404).send({ msg: "Page does not exist" });
  } else {
    next(err);
  }
};

exports.errorHandler500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
};

// controller for 405 invalid methods
exports.errorHandler405 = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
