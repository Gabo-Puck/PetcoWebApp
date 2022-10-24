const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Estado extends BaseModel {
  static get tableName() {
    return "estado";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");
    return {
      municipios: {
        relation: Model.HasManyRelation,
        modelClass: Municipio,
        join: {
          from: "estado.ID",
          to: "municipio.ID_Estado",
        },
      },
    };
  }
}

module.exports = Estado;
