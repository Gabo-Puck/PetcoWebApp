var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
const Donaciones = require("./Donaciones");
Model.knex(knex);

class Metas extends BaseModel {
  static get tableName() {
    return "metas";
  }

  static get relationMappings() {
    const Mascota = require("./Mascota");
    return {
      Mascota: {
        modelClass: Mascota,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "metas.ID_mascota",
          to: "mascota.ID",
        },
      },

      MetasDonaciones: {
        modelClass: Donaciones,
        relation: Model.HasManyRelation,
        join: {
          from: "metas.ID",
          to: "donaciones.ID_Meta",
        },

      },
    };
  }
}
module.exports = Metas;
