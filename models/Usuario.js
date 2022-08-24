const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Usuario extends BaseModel {
  static get tableName() {
    return "Usuario";
  }

  static get relationMappings() {
    const Especie = require("./Especie");
    const Formulario = require("./Formulario");
    const Solicitudes = require("./Solicitudes");
    return {
      Especies: {
        relation: Model.ManyToManyRelation,
        modelClass: Especie,
        join: {
          from: "Usuario.ID",
          through: {
            from: "Intereses.ID_Usuario",
            to: "Intereses.ID_Especie",
          },
          to: "Especie.ID",
        },
      },
      Formularios: {
        relation: Model.HasManyRelation,
        modelClass: Formulario,
        join: {
          from: "Usuario.ID",
          to: "Formulario.ID_Usuario",
        },
      },
      Solicitudes: {
        relation: Model.HasManyRelation,
        modelClass: Solicitudes,
        join: {
          from: "Usuario.ID",
          to: "Solicitudes.ID_Usuario",
        },
      },
    };
  }
}

module.exports = Usuario;
