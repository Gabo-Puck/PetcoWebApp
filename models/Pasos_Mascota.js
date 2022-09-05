var knex = require("../knex");
var { Model } = require("objection");

Model.knex(knex);

class Pasos_Mascota extends Model {
  static get tableName() {
    return "paso_mascota";
  }
  static get idColumn() {
    return ["ID_Mascota", "ID_Paso"];
  }
}

module.exports = Pasos_Mascota;
