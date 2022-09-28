const knex = require("../knex");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");
Model.knex(knex);

class Registro extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "Registro";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");
    const Usuario = require("./Usuario");

    return {
      muni: {
        relation: Model.BelongsToOneRelation,
        modelClass: Municipio,
        join: {
          from: "Registro.Municipio",
          to: "Municipio.ID",
        },
      },

      RegistroUsuario: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "Registro.ID",
          to: "Usuario.FK_Registro",
        },
      },
    };
  }
}

module.exports = Registro;
