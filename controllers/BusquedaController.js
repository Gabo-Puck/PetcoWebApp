const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Usuario_Bloqueado = require("../models/Usuario_Bloqueado");
const { createPromisesImagenesMascotas } = require("./InicioController");

// function containsWord(string, word) {
//     return new RegExp('(?:[^.\w]|^|^\\W+)' + word + '(?:[^.\w]|\\W(?=\\W+|$)|$)').test(string);
// }

function containsWord(str, word) {
  return str.match(new RegExp("\\b" + word + "\\b")) != null;
}

exports.pagina = (req, res) => {
  console.log("Increible");
  let mascotasfiltradas = new Array();
  let contador = 0;

  if (req.params.orden == 0) {
    orden = "publicacion.ID";
  } else {
    orden = "numberOfLikes";
  }
  

  Usuario_Bloqueado.query().then((usuariosB) => {
    Publicacion.query()
      .where("publicacion.Activo", "=", 1)
      .andWhere("publicacion.ID_Usuario", "!=", req.session.IdSession)
      .select(
        "publicacion.*",
        Publicacion.relatedQuery("PublicacionLike").count().as("numberOfLikes")
      )
      .orderBy(orden, "desc")
      .withGraphJoined("Mascota.MascotasPublicacion")
      .withGraphJoined("Mascota.MascotasEstado")
      .withGraphJoined("Mascota.MascotasImagenes")
      .then((result) => {
        var buscar = req.params.search.toString();
        const words = buscar.split(" ");

        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].Mascota.length; j++) {
            for (let k = 0; k < words.length; k++) {
              if ( containsWord(result[i].Mascota[j].MascotasPublicacion.Titulo.toLowerCase()  , words[k].toLowerCase() ) == true ||  containsWord(result[i].Mascota[j].MascotasPublicacion.Descripcion.toLowerCase() , words[k].toLowerCase() ) )
              {
                mascotasfiltradas[contador] = result[i].Mascota[j];
                contador++;
                break;
              }
            }
          }
        }

        console.log(mascotasfiltradas);

        if (mascotasfiltradas.length != 0) {
          //Filtrar mascotas bloqueadas
          for (let i = 0; i < mascotasfiltradas.length; i++) {
            for (let k = 0; k < usuariosB.length; k++) {
         
            if (
              (mascotasfiltradas[i].MascotasPublicacion.ID_Usuario ==
                usuariosB[k].ID_Usuario &&
                usuariosB[k].ID_Bloqueado == req.session.IdSession) ||
              (mascotasfiltradas[i].MascotasPublicacion.ID_Usuario ==
                usuariosB[k].ID_Bloqueado &&
                usuariosB[k].ID_Usuario == req.session.IdSession)
            ) {

              i = 0;
              mascotasfiltradas.splice(i, 1);
              console.log("ESTO MIDE MASCOTAS FILTRADAS " + mascotasfiltradas.length)
              if(mascotasfiltradas.length == 1)
              {

                break;
              }

            }
          }
        }

        //Filtrar mascotas por texto

        for (let index = 0; index < words.length; index++) {
          console.log("OJO aqui es" + words[index]);
        }
        let promises = [];
        for (let y = 0; y < mascotasfiltradas.length; y++) {
          const mascota = mascotasfiltradas[y];
          for (
            let index = 0;
            index < mascota.MascotasImagenes.length;
            index++
          ) {
            promises.push(
              createPromisesImagenesMascotas(
                mascota,
                mascota.MascotasImagenes[index].Ruta,
                req.app.storageFirebase,
                index
              )
            );
          }
        }
        Promise.all(promises).then(() => {
          res.render("busqueda.ejs", {
            Iorden: req.params.orden,
            MascotaRender: mascotasfiltradas,
            Tipo: req.session.Tipo,
          Itexto:req.params.search,
          });
        });

        //console.log(mascotasfiltradas);
      });
  });
};

exports.form = (req, res) => {
  //console.log(req.body);

  res.redirect(
    `/petco/busqueda/coincidencias/${req.body.Btexto}/${req.body.Borden}`
  );
};
