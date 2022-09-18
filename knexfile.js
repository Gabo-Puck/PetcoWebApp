// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "halo1234",
      database: "petcodbv2",
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "halo1234",
      database: "petcodbv2",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
