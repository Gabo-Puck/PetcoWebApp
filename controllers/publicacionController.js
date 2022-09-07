var Mascota = require("../models/Mascota");

exports.prueba = (req, res) => {
  // Mascota.query()
  //   .withGraphFetched(
  //     "[MascotasEspecie,MascotasEstado,MascotasCastrado,MascotasSalud,MascotasTamano,MascotasPublicacion,MascotasImagenes,MascotasVacunas]"
  //   )
  //   .then((resultado) => res.json(resultado));
  Mascota.query()
    .withGraphFetched(
      "[MascotasPasos.[Proto.[FormularioProtocolo.[Preguntas.[Opciones_Respuestas_Pregunta]]]]]"
    )
    .findById(10)
    .then((re) =>
      res.json(
        re.MascotasPasos[re.MascotasPasos.length - 1].Proto.FormularioProtocolo
      )
    );
};
