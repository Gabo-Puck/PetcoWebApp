var Registro = require("../models/Registro");
var Usuario = require("../models/Usuario");
var Municipio = require("../models/Municipio");
var objection = require("objection");

exports.pagina = (req, res, next) => {
    Usuario.query()
        .withGraphJoined('UsuarioRegistro')
        .where('usuario.ID', '=', req.params.idUsuario)
        .then((result) => {
            console.log(result);

            res.render('perfil.ejs', {
                user: result,

            });
        })


};