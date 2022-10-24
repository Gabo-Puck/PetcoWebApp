const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);
class Paso extends BaseModel {
  static get tableName() {
    return "paso";
  }
  static get relationMappings() {
    const Protocolo = require("./Protocolo");
    const Mascota = require("./Mascota");
    const Pasos_Mascota = require("./Pasos_Mascota");

    return {
      Proto: {
        relation: Model.BelongsToOneRelation,
        modelClass: Protocolo,
        join: {
          from: "protocolos.ID",
          to: "paso.ID_Protocolo",
        },
      },
      Mascota: {
        relation: Model.ManyToManyRelation,
        modelClass: Mascota,
        join: {
          from: "paso.ID",
          through: {
            from: "paso_mascota.ID_Paso",
            to: "paso_mascota.ID.Mascota",
          },
          to: "mascota.ID",
        },
      },
      PasoProceso: {
        relation: Model.HasManyRelation,
        modelClass: Pasos_Mascota,
        join: {
          from: "paso.ID",
          to: "paso_mascota.ID_Paso",
        },
      },
    };
  }
}

module.exports = Paso;
