const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);
class Paso extends BaseModel {
  static get tableName() {
    return "Paso";
  }
  static get relationMappings() {
    const Protocolo = require("./Protocolo");
    return {
      Proto: {
        relation: Model.BelongsToOneRelation,
        modelClass: Protocolo,
        join: {
          from: "Protocolos.ID",
          to: "Paso.ID_Protocolo",
        },
      },
    };
  }
}

module.exports = Paso;
