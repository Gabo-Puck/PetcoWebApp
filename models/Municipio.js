var knex = require("../knex");
var { Model } = require("objection");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Municipio extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "municipio";
  }
  static get relationMappings() {
    const Registro = require("./Registro");
    const Estado = require("./Estado");
    return {
      registros: {
        relation: Model.HasManyRelation,
        modelClass: Registro,
        join: {
          from: "municipio.ID",
          to: "registro.Municipio",
        },
      },
      estado: {
        relation: Model.BelongsToOneRelation,
        modelClass: Estado,
        join: {
          from: "municipio.ID_Estado",
          to: "estado.ID",
        },
      },
    };
  }
}
module.exports = Municipio;
