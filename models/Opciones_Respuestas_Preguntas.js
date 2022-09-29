const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Opciones_Respuestas_Preguntas extends BaseModel {
  static get tableName() {
    return "opciones_respuestas_preguntas";
  }

  static get relationMappings() {
    const Preguntas = require("./Preguntas");
    return {
      Pregunta: {
        relation: Model.BelongsToOneRelation,
        modelClass: Preguntas,
        join: {
          from: "opciones_respuestas_preguntas.ID_Pregunta",
          to: "preguntas.ID",
        },
      },
    };
  }
}

module.exports = Opciones_Respuestas_Preguntas;
