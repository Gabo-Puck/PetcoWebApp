var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");

Model.knex(knex);

class Comentario extends BaseModel {
  static get tableName() {
    return "comentario";
  }
  static get relationMappings() {

    const Publicacion = require("./Publicacion");
    const Usuario = require("./Usuario");
    return {
        ComentariosPublicacion: {
            modelClass: Publicacion,
            relation: Model.BelongsToOneRelation,
            join: {
              from: "comentario.ID_Publicacion",
              to: "publicacion.ID",
            },
          },
          ComentariosUsuario: {
            modelClass: Usuario,
            relation: Model.BelongsToOneRelation,
            join: {
              from: "comentario.ID_Usuario",
              to: "Usuario.ID",
            },
          },
    };
  }
}

module.exports = Comentario;
