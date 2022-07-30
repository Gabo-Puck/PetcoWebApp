const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");

class Opciones_Respuestas_Preguntas extends BaseModel {
  static get tableName() {
    return "Opciones_Respuestas_Preguntas";
  }

  static get relationMappings() {
    const Preguntas = require("./Preguntas");
    return {
      Pregunta: {
        relation: Model.BelongsToOneRelation,
        modelClass: Preguntas,
        join: {
          from: "Opciones_Respuestas_Preguntas.ID_Pregunta",
          to: "Preguntas.ID",
        },
      },
    };
  }
}

module.exports = Opciones_Respuestas_Preguntas;
