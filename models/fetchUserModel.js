const connection = require("../connection");

exports.fetchUser = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};
