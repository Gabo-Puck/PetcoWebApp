const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Solicitudes extends BaseModel {
  static get tableName() {
    return "solicitudes";
  }

  static get relationMappings() {
    const Respuestas = require("./Respuestas");
    const Usuario = require("./Usuario");
    const Mascota = require("./Mascota");
    return {
      RespuestasFormulario: {
        relation: Model.HasManyRelation,
        modelClass: Respuestas,
        join: {
          from: "solicitudes.ID",
          to: "respuestas.ID_Solicitud",
        },
      },
      Usuario: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "solicitudes.ID_Usuario",
          to: "usuario.ID",
        },
      },
      Mascota: {
        relation: Model.BelongsToOneRelation,
        modelClass: Usuario,
        join: {
          from: "solicitudes.ID_Mascota",
          to: "mascota.ID",
        },
      },
    };
  }
}

module.exports = Solicitudes;
