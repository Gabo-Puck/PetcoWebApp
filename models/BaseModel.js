var { Model } = require("objection");
var knex = require("../knex");

class BaseModel extends Model {
  static get idColumn() {
    return "ID";
  }
  constructor() {
    super();
    Model.knex(knex);
  }
}
module.exports = BaseModel;
