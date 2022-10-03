var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Like extends BaseModel {
    static get tableName() {
        return "like";
    }
    static get relationMappings() {
        const Usuario = require("./Usuario");
        const Publicacion = require("./Publicacion");
    return {
     
      LikeUsuario: {
        modelClass: Usuario,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "like.ID_Usuario",
          to: "usuario.ID",
        },
      },
      LikePublicacion: {
        modelClass: Publicacion,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "like.ID_Publicacion",
          to: "publicacion.ID",
        },
      },
    };
  }
}

module.exports = Like;
