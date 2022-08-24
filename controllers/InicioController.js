var Intereses = require("../models/Intereses");
var Especie = require("../models/Especie");

var objection = require("objection");
const { name } = require("ejs");


exports.Inicio = (req, res) => {

    res.render("Homepage.ejs");
    if (req.session.Logged) { //Revisa si el usuario esta logeado en la pagina


        Intereses.query()
            .where("Intereses.ID_Usuario", "=", req.session.IdSession)
            .then((Result) => {
                if (Result.length < 3) {//Revisa que el usuario tenga 3 intereses
                    console.log(Result);
                    res.redirect('/inicio/intereses');
                }
                else {
                    res.render('feed.ejs');//El usuario esta logeado y tiene los intereses correspondientes




                }
            });


    }
    else {
        res.redirect('/login');
    }

}

exports.SeleccionarIntereses = (req, res) => {

    Especie.query()
        .then((Result) => {
            res.render('SeleccionarIntereses.ejs', {
                Animales: Result
            });
            console.log(Result);

        });

}

exports.CrearIntereses = (req, res) => {
    var array = req.body.Escogidos;
    console.log(array.length);
    console.log(array[1]);
    console.log(array);
    console.log(req.session.IdSession);

    for (var i = 0; i < 3; i++) {

        Intereses.query()
            .insert({
                ID_Usuario: req.session.IdSession,
                ID_Especie: array[i]
            })
            .then((registroCreado) => {
                
            });

    }

    res.redirect('/inicio' );
    
}
