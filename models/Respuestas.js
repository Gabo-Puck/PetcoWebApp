const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Respuestas extends BaseModel {
  static get tableName() {
    return "Respuestas";
  }

  static get relationMappings() {
    const Preguntas = require("./Preguntas");
    const Solicitudes = require("./Solicitudes");
    return {
      Pregunta: {
        relation: Model.HasOneRelation,
        modelClass: Preguntas,
        join: {
          from: "Respuestas.ID_Pregunta",
          to: "Preguntas.ID",
        },
      },
      Solicitud: {
        relation: Model.HasOneRelation,
        modelClass: Solicitudes,
        join: {
          from: "Respuestas.ID_Solicitud",
          to: "Solicitudes.ID",
        },
      },
    };
  }
}
module.exports = Respuestas;
