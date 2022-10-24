var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Publicacion_Guardada extends Model {
    static get tableName() {
        return "publicacion_guardada";
    }
    static get relationMappings() {
        const Usuario = require("./Usuario");
        const Publicacion = require("./Publicacion");
        return {

            UsuarioG: {
                modelClass: Usuario,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: "publicacion_guardada.ID_Usuario",
                    to: "usuario.ID",
                },
            },
            PublicacionG: {
                modelClass: Publicacion,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: "publicacion_guardada.ID_Publicacion",
                    to: "publicacion.ID",
                },
            },
        };
    }
}

module.exports = Publicacion_Guardada;
