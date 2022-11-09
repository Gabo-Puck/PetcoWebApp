const Mascota = require("../models/Mascota");
const Publicacion = require("../models/Publicacion");
const Usuario_Bloqueado = require("../models/Usuario_Bloqueado");

function containsWord(string, word) {
    return new RegExp('(?:[^.\w]|^|^\\W+)' + word + '(?:[^.\w]|\\W(?=\\W+|$)|$)').test(string);
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
        const words = buscar.split(' ');

        for (let i = 0; i < result.length; i++) {
    
          for (let j = 0; j < result[i].Mascota.length; j++) {

            for (let k = 0; k < words.length; k++) {
              if ( containsWord(result[i].Mascota[j].MascotasPublicacion.Titulo , words[k]) == true)
              {
                mascotasfiltradas[contador] = result[i].Mascota[j];
                contador++;
              }
            }
          }
        }


        console.log(mascotasfiltradas)

        if (mascotasfiltradas.length !=0)
        {

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
              mascotasfiltradas.splice(i, 1);
              i = 0;
              if(mascotasfiltradas.length == 0)
              {
                break;
              }
            }
          }
        }
        
      }

        //Filtrar mascotas por texto
       
        for (let index = 0; index < words.length; index++) {
        console.log( "OJO aqui es"+ words[index])
        }

        //console.log(mascotasfiltradas);
        res.render("busqueda.ejs", {
          Iorden:req.params.orden,
          MascotaRender: mascotasfiltradas,
          Tipo: req.session.Tipo,
        });
      });
  });
};

exports.form = (req, res) => {
  //console.log(req.body);

  res.redirect(
    `/petco/busqueda/coincidencias/${req.body.Btexto}/${req.body.Borden}`
  );
};
