var BaseModel = require("./BaseModel");
var knex = require("../knex");
var { Model } = require("objection");
Model.knex(knex);

class Castrado extends BaseModel {
  static get tableName() {
    return "castrado";
  }

  static get relationMappings() {
    const Mascota = require("./Mascota");
    return {
      MascotaRel: {
        relation: Model.HasManyRelation,
        modelClass: Mascota,
        join: {
          from: "castrado.ID",
          to: "mascota.ID_Castrado",
        },
      },
    };
  }
}

module.exports = Castrado;
