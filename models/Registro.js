const knex = require("../knex");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");
Model.knex(knex);

class Registro extends BaseModel {
  constructor() {
    super();
  }

  $formatJson(json) {
    json = super.$formatJson(json);

    return json;
  }

  static get tableName() {
    return "registro";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");
    const Usuario = require("./Usuario");

    return {
      muni: {
        relation: Model.BelongsToOneRelation,
        modelClass: Municipio,
        join: {
          from: "registro.Municipio",
          to: "municipio.ID",
        },
      },

      RegistroUsuario: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "registro.ID",
          to: "usuario.FK_Registro",
        },
      },
    };
  }
}

module.exports = Registro;
