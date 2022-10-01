const { Model } = require("objection");
const BaseModel = require("./BaseModel");
const knex = require("../knex");
Model.knex(knex);

class Formulario extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "formulario";
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
          from: "formulario.ID_Usuario",
          to: " usuario.ID",
        },
      },
      Preguntas: {
        relation: Model.ManyToManyRelation,
        modelClass: Preguntas,
        join: {
          from: "formulario.ID",
          through: {
            from: "preguntas_formulario.ID_Formulario",
            to: "preguntas_formulario.ID_Pregunta",
          },
          to: "preguntas.ID",
        },
      },
      Protocolo: {
        relation: Model.HasManyRelation,
        modelClass: Protocolo,
        join: {
          from: "formulario.ID",
          to: "protocolos.ID_Formulario",
        },
      },
    };
  }
}

module.exports = Formulario;
