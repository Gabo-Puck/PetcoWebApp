const BaseModel = require("./BaseModel");
const { Model } = require("objection");

class Usuario extends BaseModel {
  static get tableName() {
    return "Usuario";
  }

  static get relationMappings() {
    const Especie = require("./Especie");
    return {
      Especies: {
        relation: Model.ManyToManyRelation,
        modelClass: Especie,
        join: {
          from: "Usuario.ID",
          through: {
            from: "Intereses.ID_Usuario",
            to: "Intereses.ID_Especie",
          },
          to: "Especie.ID",
        },
      },
    };
  }
}

module.exports = Usuario;
