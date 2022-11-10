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
    const Notificaciones = require("./Notificaciones");
    const Reportes_Publicacion = require("./Reporte_Publicacion");
    const Publicacion = require("./Publicacion");

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
      UsuarioRegistro: {
        relation: Model.HasOneRelation,
        modelClass: Registro,
        join: {
          from: "usuario.FK_Registro",
          to: "registro.ID",
        },
      },

      UR: {
        relation: Model.HasOneRelation,
        modelClass: Registro,
        join: {
          from: "usuario.FK_Registro",
          to: "registro.ID",
        },
      },
      Notificaciones: {
        relation: Model.HasManyRelation,
        modelClass: Notificaciones,
        join: {
          from: "usuario.ID",
          to: "notificaciones.ID_Usuario",
        },
      },
      ReportesEnviados: {
        relation: Model.HasManyRelation,
        modelClass: Reportes_Publicacion,
        join: {
          from: "usuario.ID",
          to: "reporte_publicacion.ID_Usuario_Reporta",
        },
      },
      ReportesRecibidos: {
        relation: Model.HasManyRelation,
        modelClass: Reportes_Publicacion,
        join: {
          from: "usuario.ID",
          to: "reporte_publicacion.ID_Usuario_Reportado",
        },
      },
      Publicaciones: {
        relation: Model.HasManyRelation,
        modelClass: Publicacion,
        join: {
          from: "usuario.ID",
          to: "publicacion.ID_Usuario",
        },
      },
    };
  }
}

module.exports = Usuario;
