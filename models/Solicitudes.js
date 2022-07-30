const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Solicitudes extends BaseModel {
  static get tableName() {
    return "Solicitudes";
  }

  static get relationMappings() {
    const Respuestas = require("./Respuestas");
    return {
      RespuestasFormulario: {
        relation: Model.HasManyRelation,
        modelClass: Respuestas,
        join: {
          from: "Solicitudes.ID",
          to: "Respuestas.ID_Solicitud",
        },
      },
    };
  }
}

module.exports = Solicitudes;
