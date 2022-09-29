// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "fdb32.awardspace.net",
      port: 3306,
      user: "4139525_petcowebapp",
      password: "123456789A",
      database: "4139525_petcowebapp",
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
    client: "mysql2",
    connection: {
      host: "containers-us-west-67.railway.app",
      port: 5801,
      user: "root",
      password: "lfhlMhu37lvzAcIdfOYs",
      database: "railway",
    },
  },
};
