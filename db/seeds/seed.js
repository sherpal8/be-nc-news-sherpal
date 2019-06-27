const {
  topicData,
  userData,
  articleData,
  commentData
} = require("../index.js");

// utils functions- TDD based
const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

// the start of the async knex promise for seeding
exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]).then(
        ([topics, users]) => {
          // a signage for number of topics inserted
          // console.log(`${topics.length} topics were inserted`);

          // a signage for number of users inserted
          // console.log(`${users.length} users were inserted`);

          // process articleData with utils function to reformat time
          // to become psql schema compliant
          formatDate(articleData);

          // insert modified articlesData into articles table
          return knex("articles")
            .insert(articleData)
            .returning("*");
        }
      );
    })
    .then(articleRows => {
      // a signage for number of articles inserted
      // console.log(`${articleRows.length} articles were inserted`);

      // process raw data to fill the appropriate designated columns
      // process time to be sql compliant
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
