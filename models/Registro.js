const knex = require("../knex");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Registro extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "Registro";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");

    return {
      muni: {
        relation: Model.BelongsToOneRelation,
        modelClass: Municipio,
        join: {
          from: "Registro.Municipio",
          to: "Municipio.ID",
        },
      },
    };
  }
}

module.exports = Registro;
