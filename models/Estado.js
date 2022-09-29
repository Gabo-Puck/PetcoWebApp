const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Estado extends BaseModel {
  static get tableName() {
    return "railway.Estado";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");
    return {
      municipios: {
        relation: Model.HasManyRelation,
        modelClass: Municipio,
        join: {
          from: "railway.Estado.ID",
          to: "railway.Municipio.ID_Estado",
        },
      },
    };
  }
}

module.exports = Estado;
