const BaseModel = require("./BaseModel");
const { Model } = require("objection");
const knex = require("../knex");

Model.knex(knex);

class Mensajes extends BaseModel {
  static get tableName() {
    return "mensajes";
  }
  static get relationMappings() {
    const Usuario = require("../models/Usuario");
    const Solicitud = require("../models/Solicitudes");
    return {
      Remitente: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "mensajes.Usuario_Remitente",
          to: "usuario.ID",
        },
      },
      Solicitud: {
        relation: Model.HasOneRelation,
        modelClass: Solicitud,
        join: {
          from: "mensajes.ID_Solicitud",
          to: "solicitudes.ID",
        },
      },
    };
  }
}

module.exports = Mensajes;
