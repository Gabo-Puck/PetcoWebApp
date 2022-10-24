var knex = require("../knex");
var { Model } = require("objection");

Model.knex(knex);

class Pasos_Mascota extends Model {
  static get tableName() {
    return "paso_mascota";
  }
  static get idColumn() {
    return "ID";
  }

  static get relationMappings() {
    const Paso = require("./Paso");
    return {
      Paso: {
        relation: Model.HasOneRelation,
        modelClass: Paso,
        join: {
          from: "paso_mascota.ID_Paso",
          to: "paso.ID",
        },
      },
    };
  }
}

module.exports = Pasos_Mascota;
