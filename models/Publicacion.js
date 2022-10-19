var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
const Like = require("./Like");
const Publicacion_Guardada = require("./Publicacion_Guardada");
Model.knex(knex);

class Publicacion extends BaseModel {
  static get tableName() {
    return "publicacion";
  }
  static get relationMappings() {
    const Reporte_Publicacion = require("./Reporte_Publicacion"); 
    const Usuario = require("./Usuario");
    const Mascotas = require("./Mascota");
    return {
      Mascota: {
        modelClass: Mascotas,
        relation: Model.HasManyRelation,
        join: {
          from: "publicacion.ID",
          to: "mascota.ID_Publicacion",
        },
      },
      PublicacionComentario: {
        modelClass: Mascotas,
        relation: Model.HasManyRelation,
        join: {
          from: "publicacion.ID",
          to: "mascota.ID_Publicacion",
        },
      },

      PublicacionUsuario: {
        modelClass: Usuario,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "publicacion.ID_Usuario",
          to: "usuario.ID",
        },
      },

      PublicacionLike: {
        modelClass: Like,
        relation: Model.HasManyRelation,
        join: {
          to: "publicacion.ID",
          from: "like.ID_Publicacion",
        },
      },

      PublicacionReporte: {
        modelClass: Reporte_Publicacion,
        relation: Model.HasManyRelation,
        join: {
          from: "publicacion.ID",
          to: "reporte_publicacion.ID_Publicacion",
        },
      },

      PublicacionGuardada: {
        modelClass: Publicacion_Guardada,
        relation: Model.HasManyRelation,
        join: {
          from: "publicacion.ID",
          to: "publicacion_guardada.ID_Publicacion",
        },
      },

      
    };
  }
}

module.exports = Publicacion;
