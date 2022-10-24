const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);
class Protocolo extends BaseModel {
  static get tableName() {
    return "protocolos";
  }
  static get relationMappings() {
    const Paso = require("./Paso");
    const Formulario = require("./Formulario");
    const Usuario = require("./Usuario");
    return {
      Pasos: {
        relation: Model.HasManyRelation,
        modelClass: Paso,
        join: {
          from: "protocolos.ID",
          to: "paso.ID_Protocolo",
        },
      },
      FormularioProtocolo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Formulario,
        join: {
          from: "protocolos.ID_Formulario",
          to: "formulario.ID",
        },
      },
      UsuarioProto: {
        relation: Model.BelongsToOneRelation,
        modelClass: Usuario,
        join: {
          from: "protocolos.ID_Usuario",
          to: "usuario.ID",
        },
      },
    };
  }
}

module.exports = Protocolo;
