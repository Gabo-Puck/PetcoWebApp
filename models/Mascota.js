var { Model } = require("objection");
var BaseModel = require("./BaseModel");
var knex = require("../knex");
Model.knex(knex);

class Mascota extends BaseModel {
  static get tableName() {
    return "mascota";
  }

  static get relationMappings() {
    const Castrado = require("./Castrado");
    const Salud = require("./Salud");
    const Tamano = require("./Tamano");
    const Publicacion = require("./Publicacion");
    const Especie = require("./Especie");
    const Estado = require("./Estado_Mascota");
    const Vacunas = require("./Vacunas");
    const Imagenes = require("./Imagenes");
    const Solicitud = require("./Solicitudes");
    const Pasos = require("./Paso");
    return {
      MascotasCastrado: {
        modelClass: Castrado,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Castrado",
          to: "castrado.ID",
        },
      },
      MascotasSalud: {
        modelClass: Salud,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Salud",
          to: "salud.ID",
        },
      },
      MascotasTamano: {
        modelClass: Tamano,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Tamano",
          to: "tamano.ID",
        },
      },
      MascotasPublicacion: {
        modelClass: Publicacion,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Publicacion",
          to: "publicacion.ID",
        },
      },
      MascotasEspecie: {
        modelClass: Especie,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Especie",
          to: "especie.ID",
        },
      },
      MascotasEstado: {
        modelClass: Estado,
        relation: Model.BelongsToOneRelation,
        join: {
          from: "mascota.ID_Estado",
          to: "estado_mascota.ID",
        },
      },
      MascotasVacunas: {
        modelClass: Vacunas,
        relation: Model.ManyToManyRelation,
        join: {
          from: "mascota.ID",
          through: {
            from: "vacunas_mascota.ID_Mascota",
            to: "vacunas_mascota.ID_Vacuna",
          },
          to: "vacunas.ID",
        },
      },
      MascotasImagenes: {
        modelClass: Imagenes,
        relation: Model.ManyToManyRelation,
        join: {
          from: "mascota.ID",
          through: {
            from: "imagenes_mascota.ID_Mascota",
            to: "imagenes_mascota.ID_Imagen",
          },
          to: "imagenes.ID",
        },
      },
      MascotasPasos: {
        modelClass: Pasos,
        relation: Model.ManyToManyRelation,
        join: {
          from: "mascota.ID",
          through: {
            from: "paso_mascota.ID_Mascota",
            to: "paso_mascota.ID_Paso",
          },
          to: "Paso.ID",
        },
      },
      MascotasSolicitudes: {
        modelClass: Solicitud,
        relation: Model.HasManyRelation,
        join: {
          from: "mascota.ID",
          to: "solicitudes.ID_Mascota",
        },
      },
    };
  }
}

module.exports = Mascota;
