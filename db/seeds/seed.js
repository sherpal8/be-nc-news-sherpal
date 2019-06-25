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
          console.log(`${topics.length} topics were inserted`);
          // a signage for number of users inserted
          console.log(`${users.length} users were inserted`);

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
      console.log(`${articleRows.length} articles were inserted`);
      console.log(articleRows, commentData);
      /*
    Your comment data is currently in the incorrect format and will violate your SQL schema.
    Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id.
    You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
    */
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
