const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");

class Preguntas extends BaseModel {
  static get tableName() {
    return "Preguntas";
  }

  static get relationMappings() {
    const Formulario = require("./Formulario");
    const Opciones_Respuesta = require("./Opciones_Respuestas_Preguntas");
    return {
      Formulario: {
        relation: Model.ManyToManyRelation,
        modelClass: Formulario,
        join: {
          from: "Preguntas.ID",
          through: {
            from: "Preguntas_Formulario.ID_Pregunta",
            to: "Preguntas_Formulario.ID_Formulario",
          },
          to: "Formulario.ID",
        },
      },
      Opciones_Respuestas_Pregunta: {
        relation: Model.HasManyRelation,
        modelClass: Opciones_Respuesta,
        join: {
          from: "Preguntas.ID",
          to: "Opciones_Respuestas_Preguntas.ID_Pregunta",
        },
      },
    };
  }
}

module.exports = Preguntas;
