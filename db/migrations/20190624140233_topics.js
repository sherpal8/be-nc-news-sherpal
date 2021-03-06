exports.up = function(knex, Promise) {
  // console.log("Creating topics table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description");
  });
};

exports.down = function(knex, Promise) {
  // console.log("Removing topics table");
  return knex.schema.dropTable("topics");
};
