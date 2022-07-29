var BaseModel = require("./BaseModel");
const { Model } = require("objection");
var knex = require("../knex");
Model.knex(knex);

class Vacunas_Especie extends Model {
  static get tableName() {
    return "vacunas_especie";
  }
  static get idColumn() {
    return ["ID_Vacuna", "ID_Especie"];
  }
}
module.exports = Vacunas_Especie;
