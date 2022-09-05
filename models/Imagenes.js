var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Imagenes extends BaseModel {
  static get tableName() {
    return "imagenes";
  }

  static get relationMappings() {
    const Mascota = require("./Mascota");
    return {
      Mascota: {
        modelClass: Mascota,
        join: {
          from: "imagenes.ID",
          through: {
            from: "imagenes_mascota.ID_Imagen",
            to: "imagenes_mascota.ID_Mascota",
          },
          to: "mascota.ID",
        },
      },
    };
  }
}
module.exports = Imagenes;
