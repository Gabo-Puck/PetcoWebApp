const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Usuario extends BaseModel {
  $formatJson(json) {
    json = super.$formatJson(json);
    if (json.FK_Registro) delete json.FK_Registro;

    return json;
  }
  static get tableName() {
    return "railway.Usuario";
  }

  static get relationMappings() {
    const Especie = require("./Especie");
    const Formulario = require("./Formulario");
    const Solicitudes = require("./Solicitudes");
    const Protocolo = require("./Protocolo");
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
      Protocolos: {
        relation: Model.HasManyRelation,
        modelClass: Protocolo,
        join: {
          from: "Usuario.ID",
          to: "Protocolos.ID_Usuario",
        },
      },
    };
  }
}

module.exports = Usuario;
