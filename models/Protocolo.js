const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);
class Protocolo extends BaseModel {
  static get tableName() {
    return "Protocolos";
  }
  static get relationMappings() {
    const Paso = require("./Paso");
    return {
      Pasos: {
        relation: Model.HasManyRelation,
        modelClass: Paso,
        join: {
          from: "Protocolos.ID",
          to: "Paso.ID_Protocolo",
        },
      },
    };
  }
}

module.exports = Protocolo;
