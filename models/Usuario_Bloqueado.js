var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");
Model.knex(knex);

class Usuario_Bloqueado extends Model {
    static get tableName() {
        return "usuario_bloqueado";
    }
    static get relationMappings() {
        const Usuario = require("./Usuario");
        const Publicacion = require("./Publicacion");
        return {

            UsuarioBloqueado: {
                modelClass: Usuario,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: "usuario_bloqueado.ID_Usuario",
                    to: "usuario.ID",
                },
            },

        };
    }
}

module.exports = Usuario_Bloqueado;
