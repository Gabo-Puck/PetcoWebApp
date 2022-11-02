const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Usuario_Bloqueado = require("../models/Usuario_Bloqueado");

exports.pagina = (req, res) => {

    
    let mascotasfiltradas = new Array();
    let contador = 0;

  const indicador = ["=", "=", "=", "=", "=", "<"];
  var orden;

  if (req.params.orden == 0) {
    orden = "publicacion.ID";
  } else {
    orden = "numberOfLikes";
  }

  if (req.params.tamano == 0) {
    indicador[1] = ">=";
  }

  if (req.params.castrado == 0) {
    indicador[2] = ">=";
  }

  if (req.params.salud == 0) {
    indicador[3] = ">=";
  }

  if (req.params.estado == 0) {
    indicador[4] = ">=";
  }

    // Mascota.query()
    //     .withGraphJoined("MascotasPublicacion")
    //     .withGraphJoined("MascotasEstado")
    //     .withGraphJoined("MascotasImagenes")
    //     .orderBy(orden)
    //     .andWhere("mascota.ID_Especie", indicador[0], req.params.especie)
    //     .andWhere("mascota.ID_Tamano",indicador[1], req.params.tamano)
    //     .andWhere("mascota.ID_Castrado",indicador[2], req.params.castrado)
    //     .andWhere("mascota.ID_Salud", indicador[3], req.params.salud)
    //     .andWhere("mascota.ID_Estado",indicador[4], req.params.estado)
    //     .andWhere("mascota.Edad", indicador[5],req.params.edad)
    //     .then((resultado) => {
    //         console.log(resultado);
    //         res.render("busqueda.ejs", {
    //             Iespecie: req.params.especie,
    //             Itamano: req.params.tamano,
    //             Icastrado: req.params.castrado,
    //             Isalud: req.params.salud,
    //             Iestado: req.params.estado,
    //             Iedad:req.params.edad,
    //             Iorden:req.params.orden,
    //             MascotaRender: resultado
    //         });
    //     })
    Usuario_Bloqueado.query()
        .then((usuariosB) => {
            Publicacion.query()
                .where("publicacion.Activo", "=", 1)
                .select(
                    "publicacion.*",
                    Publicacion.relatedQuery("PublicacionLike")
                        .count()
                        .as("numberOfLikes")
                )
                .orderBy(orden, "desc")
                .withGraphJoined("Mascota.MascotasPublicacion")
                .withGraphJoined("Mascota.MascotasEstado")
                .withGraphJoined("Mascota.MascotasImagenes")
                .andWhere("Mascota.ID_Especie", "=", req.params.especie)
                .andWhere("Mascota.ID_Tamano", indicador[1], req.params.tamano)
                .andWhere("Mascota.ID_Castrado", indicador[2], req.params.castrado)
                .andWhere("Mascota.ID_Salud", indicador[3], req.params.salud)
                .andWhere("Mascota.ID_Estado", indicador[4], req.params.estado)
                .andWhere("Mascota.Edad", indicador[5], req.params.edad)

                .then((result) => {

                    for (let i = 0; i < result.length; i++) {

                        for (let j = 0; j < result[i].Mascota.length; j++) {

                            mascotasfiltradas[contador] = result[i].Mascota[j];

                            contador++;


                        }

                    }

                    for (let i = 0; i < mascotasfiltradas.length; i++) {


                        for (let k = 0; k < usuariosB.length; k++) {
                            console.log("a " + mascotasfiltradas[i].MascotasPublicacion.ID_Usuario + " d " + mascotasfiltradas[i].MascotasPublicacion.ID + " b " + usuariosB[k].ID_Usuario + " c " + usuariosB[k].ID_Bloqueado)
                            if (mascotasfiltradas[i].MascotasPublicacion.ID_Usuario == usuariosB[k].ID_Usuario && usuariosB[k].ID_Bloqueado == req.session.IdSession
                                || (mascotasfiltradas[i].MascotasPublicacion.ID_Usuario == usuariosB[k].ID_Bloqueado && usuariosB[k].ID_Usuario == req.session.IdSession)
                            ) {
                                mascotasfiltradas.splice(i, 1);
                                i = 0;
                            }
                        }

                    }

                    console.log(mascotasfiltradas);
                    res.render("busqueda.ejs", {
                        Iespecie: req.params.especie,
                        Itamano: req.params.tamano,
                        Icastrado: req.params.castrado,
                        Isalud: req.params.salud,
                        Iestado: req.params.estado,
                        Iedad: req.params.edad,
                        Iorden: req.params.orden,
                        MascotaRender: mascotasfiltradas
                    });


                })

        })



};

exports.form = (req, res) => {
  console.log(req.body);

  res.redirect(
    `/petco/busqueda/coincidencias/${req.body.BEspecie}/${req.body.BTamano}/${req.body.BCastrado}/${req.body.BSalud}/${req.body.BEstado}/${req.body.Bedad}/${req.body.Borden}`
  );
};
