var knex = require("../knex");
var { Model } = require("objection");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Municipio extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "railway.Municipio";
  }
  static get relationMappings() {
    const Registro = require("./Registro");
    const Estado = require("./Estado");
    return {
      registros: {
        relation: Model.HasManyRelation,
        modelClass: Registro,
        join: {
          from: "railway.Municipio.ID",
          to: "railway.Registro.Municipio",
        },
        estado: {
          relation: Model.BelongsToOneRelation,
          modelClass: Estado,
          join: {
            from: "railway.Municipio.ID_Estado",
            to: "railway.Estado.ID",
          },
        },
      },
    };
  }
}
module.exports = Municipio;
