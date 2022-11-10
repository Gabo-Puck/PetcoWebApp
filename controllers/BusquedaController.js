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

  const indicador = ["=", "=", "=", "=", "=", "<"];
  var orden;

  if (req.params.orden == 0) {
    orden = "publicacion.ID";
  } else {
    orden = "numberOfLikes";
  }

  if (req.params.especie == 0) {
    indicador[0] = "!=";
  }

  else
  {indicador[0] = "=";}

  if (req.params.tamano == 0) {
    indicador[1] = ">=";
  }

  if (req.params.castrado == 0) {
    indicador[2] = ">=";
  }

  if (req.params.salud == 0) {
    indicador[3] = ">=";
  }

  if (req.params.orden == 0) {
    orden = "publicacion.ID";
  } else {
    orden = "numberOfLikes";
  }

  if (req.params.edad == 0) {
    indicador[5] = ">=";
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
      .withGraphJoined("Mascota.MP.PublicacionUsuario.[UR.muni.estado]")
      .withGraphJoined("Mascota.MascotasPublicacion")
      .withGraphJoined("Mascota.MascotasEstado")
      .withGraphJoined("Mascota.MascotasImagenes")
      .andWhere("Mascota.ID_Especie", indicador[0], req.params.especie)
      .andWhere("Mascota.ID_Tamano", indicador[1], req.params.tamano)
      .andWhere("Mascota.ID_Castrado", indicador[2], req.params.castrado)
      .andWhere("Mascota.ID_Salud", indicador[3], req.params.salud)
      .andWhere("Mascota.Edad", indicador[5], req.params.edad)
      .then((result) => {
        var buscar = req.params.search.toString();
        const words = buscar.split(" ");
        

        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].Mascota.length; j++) {
            for (let k = 0; k < words.length; k++) {
              if ( containsWord(result[i].Mascota[j].MascotasPublicacion.Titulo.toLowerCase(),words[k].toLowerCase() ) == true 
              ||  containsWord(result[i].Mascota[j].MascotasPublicacion.Descripcion.toLowerCase() , words[k].toLowerCase()) 
              || containsWord(result[i].Mascota[j].Nombre.toLowerCase(), words[k].toLowerCase()) == true
              || containsWord(result[i].Mascota[j].Descripcion.toLowerCase(), words[k].toLowerCase() )== true
              )
              {
                mascotasfiltradas[contador] = result[i].Mascota[j];
                contador++;
                break;
              }
            }
          }
        }

        console.log(mascotasfiltradas);

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
            Iespecie: req.params.especie,
            Itamano: req.params.tamano,
            Icastrado: req.params.castrado,
            Isalud: req.params.salud,
            Iedad: req.params.edad,
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
   // `/petco/busqueda/coincidencias/${req.body.Btexto}/${req.body.Borden}`
   `/petco/busqueda/coincidencias/${req.body.BEspecie}/${req.body.BTamano}/${req.body.BCastrado}/${req.body.BSalud}/${req.body.Bedad}/${req.body.Btexto}/${req.body.Borden}`

  );
};
