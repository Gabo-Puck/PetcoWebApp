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
    return "usuario";
  }

  static get relationMappings() {
    const Especie = require("./Especie");
    const Formulario = require("./Formulario");
    const Solicitudes = require("./Solicitudes");
    const Protocolo = require("./Protocolo");
    const Registro = require("./Registro");

    return {
      Especies: {
        relation: Model.ManyToManyRelation,
        modelClass: Especie,
        join: {
          from: "usuario.ID",
          through: {
            from: "intereses.ID_Usuario",
            to: "intereses.ID_Especie",
          },
          to: "especie.ID",
        },
      },
      Formularios: {
        relation: Model.HasManyRelation,
        modelClass: Formulario,
        join: {
          from: "usuario.ID",
          to: "formulario.ID_Usuario",
        },
      },
      Solicitudes: {
        relation: Model.HasManyRelation,
        modelClass: Solicitudes,
        join: {
          from: "usuario.ID",
          to: "solicitudes.ID_Usuario",
        },
      },
      Protocolos: {
        relation: Model.HasManyRelation,
        modelClass: Protocolo,
        join: {
          from: "usuario.ID",
          to: "protocolos.ID_Usuario",
        },
      },

      UsuariosRegistro: {
        relation: Model.BelongsToOneRelation,
        modelClass: Registro,
        join: {
          from: "usuario.FK_Registro",
          to: "registro.ID",
        },
      },

     
      
    };
  }
}

module.exports = Usuario;
