const { Model } = require("objection");
const BaseModel = require("./BaseModel");
const knex = require("../knex");
Model.knex(knex);

class Formulario extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "Formulario";
  }
  static get relationMappings() {
    const Usuario = require("./Usuario");
    const Preguntas = require("./Preguntas");
    const Protocolo = require("./Protocolo");
    return {
      Usuario: {
        relation: Model.BelongsToOneRelation,
        modelClass: Usuario,
        join: {
          from: "Formulario.ID_Usuario",
          to: " Usuario.ID",
        },
      },
      Preguntas: {
        relation: Model.ManyToManyRelation,
        modelClass: Preguntas,
        join: {
          from: "Formulario.ID",
          through: {
            from: "Preguntas_Formulario.ID_Formulario",
            to: "Preguntas_Formulario.ID_Pregunta",
          },
          to: "Preguntas.ID",
        },
      },
      Protocolo: {
        relation: Model.HasManyRelation,
        modelClass: Protocolo,
        join: {
          from: "Formulario.ID",
          to: "Protocolos.ID_Formulario",
        },
      },
    };
  }
}

module.exports = Formulario;
