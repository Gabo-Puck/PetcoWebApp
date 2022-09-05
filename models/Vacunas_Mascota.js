var knex = require("../knex");
var { Model } = require("objection");

Model.knex(knex);

class Vacunas_Mascota extends Model {
  static get tableName() {
    return "vacunas_mascota";
  }
  static get idColumn() {
    return ["ID_Mascota", "ID_Vacuna"];
  }
}

module.exports = Vacunas_Mascota;
