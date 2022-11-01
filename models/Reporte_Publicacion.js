var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
const Like = require("./Like");
Model.knex(knex);

class Reporte_Publicacion extends BaseModel {
  static get tableName() {
    return "reporte_publicacion";
  }
  static get relationMappings() {
    const Publicacion = require("./Publicacion");
    const Usuario = require("./Usuario");
    return {
      ReportePublicacion: {
        modelClass: Publicacion,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "reporte_publicacion.ID_Publicacion",
          to: "publicacion.ID",
        },
      },

      ReporteUsuarioReporta: {
        modelClass: Usuario,
        relation: Model.HasOneRelation,
        join: {
          from: "reporte_publicacion.ID_Usuario_Reporta",
          to: "usuario.ID",
        },
      },
    };
  }
}

module.exports = Reporte_Publicacion;
