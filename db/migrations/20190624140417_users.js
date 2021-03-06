exports.up = function(knex, Promise) {
  // console.log("Creating users table");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .notNullable();
    usersTable.string("avatar_url");
    usersTable.string("name");
  });
};

exports.down = function(knex, Promise) {
  // console.log("Removing users table");
  return knex.schema.dropTable("users");
};
