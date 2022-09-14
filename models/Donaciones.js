var { Model } = require("objection");
var knex = require("../knex");
var BaseModel = require("./BaseModel");

Model.knex(knex);

class Donaciones extends BaseModel {
    static get tableName() {
        return "donaciones";
    }

    static get relationMappings() {
        const Metas = require("./Metas");

        return {
            DonacionesMetas: {
                modelClass: Metas,
                relation: Model.BelongsToOneRelation,
                join: {
                    from: "donaciones.ID_Meta",
                    to: "meta.ID",
                },
            },

        };
    }
}
module.exports = Donaciones;
