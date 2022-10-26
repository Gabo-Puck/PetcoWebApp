const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");

exports.pagina = (req, res) => {

    console.log(req.params);

    Mascota.query()
        .withGraphJoined("MascotasPublicacion")
        .withGraphJoined("MascotasEstado")
        .withGraphJoined("MascotasImagenes")
        .andWhere("mascota.ID_Especie", req.params.especie)
        .andWhere("mascota.ID_Tamano", req.params.tamano)
        .andWhere("mascota.ID_Castrado", req.params.castrado)
        .andWhere("mascota.ID_Salud", req.params.salud)
        .andWhere("mascota.ID_Estado", req.params.estado)
        .andWhere("mascota.Edad", req.params.edad)

        .then((result) => {

            console.log(result);

            res.render("busqueda.ejs", {
                Iespecie: req.params.especie,
                Itamano: req.params.tamano,
                Icastrado: req.params.castrado,
                Isalud: req.params.salud,
                Iestado: req.params.estado,
                Iedad:req.params.edad,
                MascotaRender: result
            });

        })

};

exports.form = (req, res) => {


    console.log(req.body);

    res.redirect(`/petco/busqueda/coincidencias/${req.body.BEspecie}/${req.body.BTamano}/${req.body.BCastrado}/${req.body.BSalud}/${req.body.BEstado}/${req.body.Bedad}`);


}
