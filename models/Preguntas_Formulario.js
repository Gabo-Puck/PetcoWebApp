const BaseModel = require("./BaseModel");
const knex = require("../knex");
const { Model } = require("objection");
Model.knex(knex);

class Preguntas_Formulario extends Model {
  static get tableName() {
    return "Preguntas_Formulario";
  }
  static get idColumn() {
    return ["ID_Pregunta", "ID_Formulario"];
  }
}

module.exports = Preguntas_Formulario;
