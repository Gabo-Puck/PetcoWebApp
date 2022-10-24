var BaseModel = require("./BaseModel");
var knex = require("../knex");
var { Model } = require("objection");
Model.knex(knex);

class Especie extends BaseModel {
  static get tableName() {
    return "especie";
  }
  static get relationMappings() {
    const Vacuna = require("./Vacunas");
    const Usuario = require("./Usuario");
    const Mascota = require("./Mascota");

    return {
      Vacunas: {
        relation: Model.ManyToManyRelation,
        modelClass: Vacuna,
        join: {
          from: "especie.ID",
          through: {
            from: "vacunas_especie.ID_Especie",
            to: "vacunas_especie.ID_Vacuna",
          },
          to: "vacunas.ID",
        },
      },
      Usuarios: {
        relation: Model.ManyToManyRelation,
        modelClass: Usuario,
        join: {
          from: "especie.ID",
          through: {
            from: "Intereses.ID_Especie",
            to: "Intereses.ID_Usuario",
          },
          to: "usuario.ID",
        },
      },
      Mascotas: {
        relation: Model.HasManyRelation,
        modelClass: Mascota,
        join: {
          from: "castrado.ID",
          to: "mascota.ID_Castrado",
        },
      },
    };
  }
}

module.exports = Especie;
