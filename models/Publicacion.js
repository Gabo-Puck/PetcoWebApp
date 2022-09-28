var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Publicacion extends BaseModel {
  static get tableName() {
    return "publicacion";
  }
  static get relationMappings() {
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
    };
  }
}

module.exports = Publicacion;
