var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Estado_Mascota extends BaseModel {
  static get tableName() {
    return "estado_mascota";
  }

  static get relationMappings() {
    const Mascota = require("./Mascota");
    return {
      Mascota: {
        modelClass: Mascota,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "estado_mascota.ID",
          to: "mascota.ID_Estado",
        },
      },
    };
  }
}
module.exports = Estado_Mascota;
