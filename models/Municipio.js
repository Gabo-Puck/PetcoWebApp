var knex = require("../knex");
var { Model } = require("objection");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Municipio extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "Municipio";
  }
  static get relationMappings() {
    const Registro = require("./Registro");
    const Estado = require("./Estado");
    return {
      registros: {
        relation: Model.HasManyRelation,
        modelClass: Registro,
        join: {
          from: "Municipio.ID",
          to: "Registro.Municipio",
        },
        estado: {
          relation: Model.BelongsToOneRelation,
          modelClass: Estado,
          join: {
            from: "Municipio.ID_Estado",
            to: "Estado.ID",
          },
        },
      },
    };
  }
}
module.exports = Municipio;
