const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Preguntas extends BaseModel {
  static get tableName() {
    return "preguntas";
  }

  static get relationMappings() {
    const Formulario = require("./Formulario");
    const Opciones_Respuesta = require("./Opciones_Respuestas_Preguntas");
    const Respuestas = require("./Respuestas");
    return {
      Formulario: {
        relation: Model.ManyToManyRelation,
        modelClass: Formulario,
        join: {
          from: "preguntas.ID",
          through: {
            from: "preguntas_formulario.ID_Pregunta",
            to: "preguntas_formulario.ID_Formulario",
          },
          to: "formulario.ID",
        },
      },
      Opciones_Respuestas_Pregunta: {
        relation: Model.HasManyRelation,
        modelClass: Opciones_Respuesta,
        join: {
          from: "preguntas.ID",
          to: "opciones_respuestas_preguntas.ID_Pregunta",
        },
      },
      Respuestas: {
        relation: Model.HasManyRelation,
        modelClass: Respuestas,
        join: {
          from: "preguntas.ID",
          to: "respuestas.ID_Pregunta",
        },
      },
    };
  }
}

module.exports = Preguntas;
