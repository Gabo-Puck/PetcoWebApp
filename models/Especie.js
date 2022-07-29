var BaseModel = require("./BaseModel");
var { Model } = require("objection");

class Especie extends BaseModel {
  static get tableName() {
    return "especie";
  }
  static get relationMappings() {
    const Vacuna = require("./Vacunas");
    const Usuario = require("./Usuario");
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
          to: "Usuario.ID",
        },
      },
    };
  }
}

module.exports = Especie;
