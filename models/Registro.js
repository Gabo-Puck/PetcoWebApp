const knex = require("../knex");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");
const Usuario = require("./Usuario");
Model.knex(knex);

class Registro extends BaseModel {
  constructor() {
    super();
  }
  static get tableName() {
    return "railway.registro";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");

    return {
      muni: {
        relation: Model.BelongsToOneRelation,
        modelClass: Municipio,
        join: {
          from: "railway.registro.Municipio",
          to: "railway.Municipio.ID",
        },
      },

      RegistroUsuario: {
        relation: Model.HasOneRelation,
        modelClass: Usuario,
        join: {
          from: "railway.registro.ID",
          to: "railway.Usuario.FK_Registro",
        },
      },
    };
  }
}

module.exports = Registro;
