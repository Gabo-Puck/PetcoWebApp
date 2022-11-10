var Usuario = require("../models/Usuario");
var Formulario = require("../models/Formulario");
const Protocolo = require("../models/Protocolo");

exports.formDashboard = (req, res) => {
  var IdSession = req.session.IdSession;



  Protocolo.query()
    .withGraphJoined("[Pasos.[Mascota]]")
    .where("protocolos.ID_Usuario", "=", req.session.IdSession)
    .then((Protocolos) => {
      // res.render("Formulario/FormDashboard.ejs", {
      //   Elemento: Formularios,
      //   Elemento2: Protocolos,
      //   Tipo: req.session.Tipo,
      // });
      let Formularios = [];
      Protocolos.forEach((protocolo) => {
        console.log(protocolo.Titulo);
        if (protocolo.Pasos[0].Mascota.length > 0) {
          console.log("Este protocolo no se puede editar");
          protocolo.isEditable = false;
          // protocolo.FormularioProtocolo.isEditable = false;
        } else {
          console.log("Este protocolo se puede editar");
          protocolo.isEditable = true;
          // protocolo.FormularioProtocolo.isEditable = true;
        }
        // if (protocolo.FormularioProtocolo.ID != 1) {
        //   Formularios.push(protocolo.FormularioProtocolo);
        // }
        console.log(protocolo);
        console.log("\n\n");
      });
      Formulario.query()
        .withGraphJoined("Protocolo.[Pasos.[Mascota]]")
        .where("formulario.ID_Usuario", "=", req.session.IdSession)
        .then((Formularios) => {
          Formularios.forEach((formulario) => {
            if (formulario.Protocolo.length == 0) {
              formulario.isEditable = true;
            } else {
              formulario.Protocolo.forEach((protocolo) => {
                console.log(protocolo.Titulo);
                if (protocolo.Pasos[0].Mascota.length > 0) {
                  console.log("Este protocolo no se puede editar");
                  formulario.isEditable = false;
                  // protocolo.FormularioProtocolo.isEditable = false;
                } else {
                  console.log("Este protocolo se puede editar");
                  formulario.isEditable = true;
                  // protocolo.FormularioProtocolo.isEditable = true;
                }
                // if (protocolo.FormularioProtocolo.ID != 1) {
                //   Formularios.push(protocolo.FormularioProtocolo);
                // }
                console.log(protocolo);
                console.log("\n\n");
              });
            }
          });
          res.render("Formulario/FormDashboard.ejs", {
            Elemento: Formularios,
            Elemento2: Protocolos,
            Tipo: req.session.Tipo,
          });
        });
    })
    .then(() => {});
};
