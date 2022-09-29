const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Respuestas extends BaseModel {
  static get tableName() {
    return "respuestas";
  }

  static get relationMappings() {
    const Preguntas = require("./Preguntas");
    const Solicitudes = require("./Solicitudes");
    return {
      Pregunta: {
        relation: Model.HasOneRelation,
        modelClass: Preguntas,
        join: {
          from: "respuestas.ID_Pregunta",
          to: "preguntas.ID",
        },
      },
      Solicitud: {
        relation: Model.HasOneRelation,
        modelClass: Solicitudes,
        join: {
          from: "respuestas.ID_Solicitud",
          to: "solicitudes.ID",
        },
      },
    };
  }
}
module.exports = Respuestas;
