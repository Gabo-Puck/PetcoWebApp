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
    const Formulario = require("./Formulario");
    return {
      Pasos: {
        relation: Model.HasManyRelation,
        modelClass: Paso,
        join: {
          from: "Protocolos.ID",
          to: "Paso.ID_Protocolo",
        },
      },
      FormularioProtocolo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Formulario,
        join: {
          from: "Protocolos.ID_Formulario",
          to: "Formulario.ID",
        },
      },
    };
  }
}

module.exports = Protocolo;
