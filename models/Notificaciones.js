var knex = require("../knex");
var { Model } = require("objection");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Notificaciones extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "notificaciones";
  }
  static get relationMappings() {
    const Usuario = require("./Usuario");
    return {
      Usuario: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "notificaciones.ID_Usuario",
          to: "usuario.ID",
        },
      },
    };
  }
}
module.exports = Notificaciones;
