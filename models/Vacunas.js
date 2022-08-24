var BaseModel = require("./BaseModel");
var knex = require("../knex");
var { Model } = require("objection");
Model.knex(knex);

class Vacunas extends BaseModel {
  static get tableName() {
    return "vacunas";
  }
  static get relationMappings() {
    const Especie = require("./Especie");
    return {
      especie: {
        relation: Model.ManyToManyRelation,
        modelClass: Especie,
        join: {
          from: "vacunas.ID",
          through: {
            from: "vacunas_especie.ID_Vacuna",
            to: "vacunas_especie.ID_Especie",
          },
          to: "especie.ID",
        },
      },
    };
  }
}
module.exports = Vacunas;
