var Mascota = require("../models/Mascota");

exports.prueba = (req, res) => {
  Mascota.query()
    .withGraphFetched(
      "[MascotasEspecie,MascotasEstado,MascotasCastrado,MascotasSalud,MascotasTamano,MascotasPublicacion,MascotasImagenes,MascotasVacunas]"
    )
    .then((resultado) => res.json(resultado));
};
