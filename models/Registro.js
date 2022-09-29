const knex = require("../knex");
const BaseModel = require("./BaseModel");
const { Model } = require("objection");
const Usuario = require("./Usuario");
// Model.knex(knex);

class Registro extends BaseModel {
  constructor() {
    super();
  }

  static get tableName() {
    return "registro";
  }
  static get relationMappings() {
    const Municipio = require("./Municipio");

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
