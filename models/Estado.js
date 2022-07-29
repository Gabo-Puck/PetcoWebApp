const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Estado extends BaseModel {
  static get tableName() {
    return "Estado";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");
    return {
      municipios: {
        relation: Model.HasManyRelation,
        modelClass: Municipio,
        join: {
          from: "Estado.ID",
          to: "Municipio.ID_Estado",
        },
      },
    };
  }
}

module.exports = Estado;
