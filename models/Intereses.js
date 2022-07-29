const { Model } = require("objection");
const knex = require("../knex");
Model.knex(knex);

class Intereses extends Model {
  static get tableName() {
    return "Intereses";
  }
  static get idColumn() {
    return ["ID_Especie", "ID_Usuario"];
  }
}

module.exports = Intereses;
