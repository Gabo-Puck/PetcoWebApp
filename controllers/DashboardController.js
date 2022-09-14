var Usuario = require("../models/Usuario");
var Formulario = require("../models/Formulario");
const Protocolo = require("../models/Protocolo");


exports.formDashboard = (req, res) => {
    var IdSession = req.session.IdSession;
  
    Formulario.query()
      .where("Formulario.ID_Usuario", "=", IdSession)
      .then((Formularios) => {

        Protocolo.query()
        .where("Protocolos.ID_Usuario", "=", IdSession)
        .then((Protocolos)=>{

          res.render("Formulario/FormDashboard.ejs", {
            Elemento: Formularios,
            Elemento2: Protocolos,
          });
          console.log(Protocolos);

        }
        )

      });
      
  };