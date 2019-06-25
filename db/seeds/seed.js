const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

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
          console.log(`${topics.length} topics were inserted`);
          console.log(`${users.length} users were inserted`);

          // process articleData with utils function inside ./db/utils/utils.js to reformat time
          formatDate(articleData);

          return knex("articles")
            .insert(articleData)
            .returning("*");

          /* 
      Your article data is currently in the incorrect format and will violate your SQL schema. 
      You will need to write and test the provided formatDate utility function to be able insert your article data.
      Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
      */
        }
      );
    })
    .then(articleRows => {
      console.log(`${articleRows.length} articles were inserted`);
      console.log(articleRows);
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
