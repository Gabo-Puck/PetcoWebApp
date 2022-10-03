var BaseModel = require("./BaseModel");
var { Model } = require("objection");
var knex = require("../knex");
Model.knex(knex);

class Salud extends BaseModel {
  static get tableName() {
    return "salud";
  }

  static get relationMappings() {
    const Mascota = require("./Mascota");
    return {
      MascotaRel: {
        relation: Model.HasManyRelation,
        modelClass: Mascota,
        join: {
          from: "salud.ID",
          to: "mascota.ID_Salud",
        },
      },
    };
  }
}
module.exports = Salud;
