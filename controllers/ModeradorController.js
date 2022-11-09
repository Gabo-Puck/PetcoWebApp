const { forEach } = require("lodash");
const Estado = require("../models/Estado");
const Imagenes = require("../models/Imagenes");
const Publicacion = require("../models/Publicacion");
const Registro = require("../models/Registro");
const Reporte_Publicacion = require("../models/Reporte_Publicacion");
const Usuario = require("../models/Usuario");
const { deleteFiles } = require("../utils/multipartRequestHandle/index");
const { sendNotificacion } = require("./NotificacionesController");
const renderRegistroMiddleware = (req, res, next) => {
  if (res.stuff) {
    console.log("si hay estados");
  } else console.log("no hay estados");
  res.render("HacerRegistro", {
    title: "Registro moderador",
    EstadosMunicipios: res.stuff,
    errors: res.errors,
    RegistroPrevio: null,
    urlVerificarReq: "/registro/verify",
    urlGrabarReq: "/registro/crear",
    isModerador: true,
  });
};
const getAllEstados = (req, res, next) => {
  Estado.query()
    .withGraphFetched("municipios")
    .then((Estados) => {
      res.stuff = Estados;
      next();
    })
    .catch((err) => next(err));
};
exports.crearModeradorGet = [getAllEstados, renderRegistroMiddleware];

//Reportes publicacion
exports.verPublicacionesReportadasGet = (req, res, next) => {
  Publicacion.query()
    // .where("publicacion.ID", "=", req.params.idP)
    .select(
      "publicacion.*",
      Publicacion.relatedQuery("PublicacionReporte")
        .count()
        .as("numeroReportes")
    )
    .having("numeroReportes", ">", 0)
    // .where("numeroReportes", ">", 0)
    .orderBy("numeroReportes", "DESC")
    .debug()
    // .whereNot("numeroReportes", "=", 0)
    .then((PublicacionesReportadas) => {
      // console.log(PublicacionesReportadas);
      res.render("Moderador/verPublicacionesReportadas.ejs", {
        Tipo: req.session.Tipo,
        PublicacionesReportadas: PublicacionesReportadas,
      });
      // resolve(countLikes);
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.verUsuariosReportadosGet = (req, res, next) => {
//   Publicacion.query()
//     // .where("publicacion.ID", "=", req.params.idP)
//     .select(
//       "publicacion.*",
//       Publicacion.relatedQuery("PublicacionReporte")
//         .count()
//         .as("numeroReportes")
//     )
//     .having("numeroReportes", ">", 0)
//     // .where("numeroReportes", ">", 0)
//     .orderBy("numeroReportes", "DESC")
//     .debug()
//     // .whereNot("numeroReportes", "=", 0)
//     .then((PublicacionesReportadas) => {
//       // console.log(PublicacionesReportadas);
//       res.render("Moderador/verPublicacionesReportadas.ejs", {
//         Tipo: req.session.IdSession,
//         PublicacionesReportadas: PublicacionesReportadas,
//       });
//       // resolve(countLikes);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.verReportesPublicacionGet = (req, res, next) => {
  Publicacion.query()
    .findById(req.params.idPublicacion)
    .then((publicacion) => {
      if (publicacion) {
        res.render("Moderador/verPublicacionReportes.ejs", {
          Publicacion: publicacion,
          Tipo: req.session.Tipo,
        });
      } else {
        res.redirect("/login");
      }
    });
};
let opcionesMapRazon = new Map();
opcionesMapRazon.set("1", "Spam");
opcionesMapRazon.set("2", "Odio");
opcionesMapRazon.set("3", "Maltrato animal");
opcionesMapRazon.set("4", "Información errónea");
opcionesMapRazon.set("5", "Promocionar ventas");
exports.obtenerReportesPublicacion = (req, res, next) => {
  if (opcionesMapRazon.has(req.params.opcion)) {
    Reporte_Publicacion.query()
      .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
      .where("Razon", "=", opcionesMapRazon.get(req.params.opcion))
      .andWhere("ID_Publicacion", "=", req.params.idPublicacion)
      .then((reportes) => {
        console.log(
          "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
          reportes
        );
        res.json(reportes);
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: ModeradorController.js ~ line 83 ~ .then ~ error",
          error
        );
        res.json("error");
      });
  } else {
    if (req.params.opcion == 0) {
      Reporte_Publicacion.query()
        .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
        .where("ID_Publicacion", "=", req.params.idPublicacion)
        .then((reportes) => {
          console.log(
            "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
            reportes
          );
          res.json(reportes);
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 98 ~ .then ~ error",
            error
          );
          res.json("error");
        });
    }
    if (req.params.opcion == 6) {
      Reporte_Publicacion.query()
        .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
        .where("ID_Publicacion", "=", req.params.idPublicacion)
        .andWhereNot("Razon", "=", opcionesMapRazon.get("1"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("2"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("3"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("4"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("5"))
        .then((reportes) => {
          console.log(
            "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
            reportes
          );
          res.json(reportes);
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 118 ~ .then ~ error",
            error
          );
          res.json("error");
        });
    }
  }
};

exports.validarReportes = (req, res, next) => {
  req.body;
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 138 ~ req.body",
    req.body
  );
  let reportes = req.body.reportes.arrayReportes;
  let reportesOtros = req.body.reportes.arrayReportesOtro;
  let idPublicacion = req.body.publicacion;
  let suma = 0;
  reportesOtros.forEach((reporte) => {
    suma += Number(reporte.Peso);
  });
  let newArray = [...reportes, ...reportesOtros];
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 162 ~ exports.validarReportes= ~ newArray.length",
    newArray.length
  );
  if (newArray.length == 0) {
    res.json("no items");
    return;
  }
  let promiseArray = [];

  newArray.forEach((promise) => {
    promiseArray.push(createPromiseReporte(promise));
  });

  Promise.all(promiseArray)
    .then(() => {
      Publicacion.query()
        .findById(idPublicacion)
        .then((publicacion) => {
          let peso = Number(publicacion.Reportes_Peso) + Number(suma);
          if (peso >= 100) {
            peso = 100;
          }
          publicacion
            .$query()
            .patch({ Reportes_Peso: peso })
            .then(() => {
              res.json("ok");
            })
            .catch((err) => {
              console.log(
                "🚀 ~ file: ModeradorController.js ~ line 186 ~ .then ~ err",
                err
              );
              next(err);
            });
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
            err
          );
          next(err);
        });
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
        err
      );
      next(err);
    });
};

exports.activarPublicacion = (req, res, next) => {
  Publicacion.query()
    .findById(req.body.idPublicacion)
    .then((publicacion) => {
      if (publicacion) {
        publicacion
          .$query()
          .patch({ Activo: 1, Reportes_Peso: 0 })
          .then(() => {
            res.json("ok");
          });
      } else {
        res.json("not found");
      }
    });
};

exports.eliminarPublicacion = (req, res, next) => {
  // Publicacion.query()
  //   .withGraphJoined("Mascota.[MascotasImagenes,MascotasProceso]")
  //   .findById(req.body.idPublicacion)
  //   .then((publicacion) => {
  //     if (publicacion) {
  //       console.log(
  //         "🚀 ~ file: ModeradorController.js ~ line 241 ~ .then ~ p",
  //         publicacion
  //       );
  //       console.log(
  //         "🚀 ~ file: ModeradorController.js ~ line 242 ~ .then ~ p",
  //         publicacion.Mascota
  //       );
  //       console.log(
  //         "🚀 ~ file: ModeradorController.js ~ line 243 ~ .then ~ p",
  //         publicacion.Mascoa.MascotaImagenes
  //       );
  //       console.log(
  //         "🚀 ~ file: ModeradorController.js ~ line 244 ~ .then ~ p",
  //         publicacion.Mascoa.MascotasProceso
  //       );
  //       res.json("ok");
  //     } else {
  //       res.json("not found");
  //     }
  //   });
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 265 ~ req.body.idPublicacion",
    req.body.idPublicacion
  );
  Publicacion.query()
    .findById(req.body.idPublicacion)
    .select("publicacion.ID")
    .withGraphJoined("Mascota.[MascotasImagenes, MascotasProceso]")
    .modifyGraph("Mascota", (builder) => {
      builder.select("mascota.ID");
    })
    .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
      builder.select("Ruta", "ID");
    })
    .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
      builder.select("Archivo");
    })
    .then((PublicacionesReportadas) => {
      console.log(
        "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
        PublicacionesReportadas
      );
      req.deleteFilesPath = [];
      let idImagenes = [];
      PublicacionesReportadas.Mascota.forEach((mascota) => {
        console.log(
          "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
          mascota.MascotasImagenes
        );
        let arrayImagenes = mascota.MascotasImagenes.map(
          (x) => "public" + x.Ruta
        );
        let arrayImagenesID = mascota.MascotasImagenes.map((x) => x.ID);
        idImagenes = idImagenes.concat(arrayImagenesID);
        let arrayArchivos = mascota.MascotasProceso.map((x) => x.Archivo);
        arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
        arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
        req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
        req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
      });
      let deleteFilesPromise = deleteFiles(req);
      Promise.all(deleteFilesPromise)
        .then(() => {
          PublicacionesReportadas.$query()
            // .delete()
            .then(() => {
              let promiseArray = [];
              idImagenes.forEach((promise) => {
                promiseArray.push(createPromiseEliminarImagen(promise));
              });
              Promise.all(promiseArray)
                .then(() => {
                  res.json("ok");
                })
                .catch((err) => {
                  console.log(
                    "🚀 ~ file: ModeradorController.js ~ line 313 ~ Promise.all ~ err",
                    err
                  );
                  next(err);
                });
            })
            .catch((err) => {
              console.log(
                "🚀 ~ file: ModeradorController.js ~ line 296 ~ PublicacionesReportadas.$query ~ e",
                err
              );
              next(err);
            });
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 300 ~ Promise.all ~ e",
            e
          );
        });
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 281 ~ .then ~ req.deleteFilesPath",
        req.deleteFilesPath
      );
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 309 ~ .then ~ err",
        err
      );
      next(err);
    });
};

exports.desactivarPublicacion = (req, res, next) => {
  console.log(req.body);
  Publicacion.query()
    .findById(req.body.idPublicacion)
    .then((publicacion) => {
      if (publicacion) {
        publicacion
          .$query()
          .patch({ Activo: 0 })
          .then(() => {
            let descripcion = `Tu publicacion "${publicacion.Titulo}" ha sido desactivada con el siguiente mensaje: "${req.body.razon}"`;

            sendNotificacion(
              descripcion,
              "#",
              publicacion.ID_Usuario,
              req.app.io
            );
            res.json("ok");
          });
      } else {
        res.json("not found");
      }
    });
};

let opcionesMapPeso = new Map();
opcionesMapPeso.set("Spam", "1");
opcionesMapPeso.set("Odio", "3");
opcionesMapPeso.set("Maltrato animal", "5");
opcionesMapPeso.set("Información errónea", "2");
opcionesMapPeso.set("Promocionar ventas", "3");
exports.invalidarReportes = (req, res, next) => {
  req.body;
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 138 ~ req.body",
    req.body
  );
  let reportes = req.body.reportes.arrayReportes;
  let reportesOtros = req.body.reportes.arrayReportesOtro;
  let idPublicacion = req.body.publicacion;
  let suma = 0;
  let newArray = [...reportes, ...reportesOtros];
  newArray.forEach((reporte) => {
    if (reporte.Peso == undefined) {
      let valor = opcionesMapPeso.get(reporte.Razon);
      suma += Number(valor);
    } else {
      suma += Number(reporte.Peso);
    }
  });
  console.log("🚀 ~ file: ModeradorController.js ~ line 226 ~ suma", suma);
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 162 ~ exports.validarReportes= ~ newArray.length",
    newArray.length
  );
  if (newArray.length == 0) {
    res.json("no items");
    return;
  }
  let promiseArray = [];

  newArray.forEach((promise) => {
    promiseArray.push(createPromiseReporte(promise));
  });

  Promise.all(promiseArray)
    .then(() => {
      Publicacion.query()
        .findById(idPublicacion)
        .then((publicacion) => {
          let peso = Number(publicacion.Reportes_Peso) - Number(suma);
          if (peso <= 0) {
            peso = 0;
          }
          publicacion
            .$query()
            .patch({ Reportes_Peso: peso })
            .then(() => {
              res.json("ok");
            })
            .catch((err) => {
              console.log(
                "🚀 ~ file: ModeradorController.js ~ line 186 ~ .then ~ err",
                err
              );
              next(err);
            });
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
            err
          );
          next(err);
        });
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
        err
      );
      next(err);
    });
};

function executePromise(promise) {
  return new Promise((resolve, reject) => {
    resolve(promise);
  });
}

function createPromiseReporte(reporte) {
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 222 ~ createPromiseReporte ~ reporte",
    reporte
  );
  return new Promise((resolve, reject) => {
    resolve(
      Reporte_Publicacion.query()
        .findById(reporte.ID)
        .delete()
        .then(() => {})
    );
  });
}

function createPromiseEliminarImagen(id) {
  // console.log(
  //   "🚀 ~ file: ModeradorController.js ~ line 222 ~ createPromiseReporte ~ reporte",
  //   reporte
  // );
  return new Promise((resolve, reject) => {
    resolve(
      Imagenes.query()
        .findById(id)
        .delete()
        .then(() => {})
    );
  });
}
//Reportes publicacion

//Reportes usuario

exports.verUsuariosReportadosGet = (req, res, next) => {
  Usuario.query()
    // .where("publicacion.ID", "=", req.params.idP)
    .withGraphJoined("[ReportesRecibidos,UsuarioRegistro]")
    .modifyGraph("UsuarioRegistro", (builder) => {
      builder.select("Nombre");
    })
    .select(
      "usuario.*",
      Usuario.relatedQuery("ReportesRecibidos")
        .whereNull("ReportesRecibidos.ID_Publicacion")
        .count()
        .as("numeroReportes")
    )
    .whereNull("ReportesRecibidos.ID_Publicacion")
    .having("numeroReportes", ">", 0)
    // .where("numeroReportes", ">", 0)
    .orderBy("numeroReportes", "DESC")
    .debug()
    // .whereNot("numeroReportes", "=", 0)
    .then((UsuariosReportados) => {
      console.log(UsuariosReportados);
      res.render("Moderador/verUsuariosReportados.ejs", {
        Tipo: req.session.Tipo,
        UsuariosReportados: UsuariosReportados,
      });
      // resolve(countLikes);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.verReportesUsuarioGet = (req, res, next) => {
  Usuario.query()
    .withGraphJoined("[UsuarioRegistro]")

    .findById(req.params.idUsuario)
    .then((usuarioFind) => {
      if (usuarioFind) {
        res.render("Moderador/verUsuarioReportes.ejs", {
          Usuario: usuarioFind,
          Tipo: req.session.Tipo,
        });
      } else {
        res.redirect("/login");
      }
    });
};

exports.obtenerReportesUsuario = (req, res, next) => {
  if (opcionesMapRazon.has(req.params.opcion)) {
    Reporte_Publicacion.query()
      .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
      .where("Razon", "=", opcionesMapRazon.get(req.params.opcion))
      .andWhere("ID_Usuario_Reportado", "=", req.params.idUsuario)
      .then((reportes) => {
        console.log(
          "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
          reportes
        );
        res.json(reportes);
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: ModeradorController.js ~ line 83 ~ .then ~ error",
          error
        );
        res.json("error");
      });
  } else {
    if (req.params.opcion == 0) {
      Reporte_Publicacion.query()
        .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
        .where("ID_Usuario_Reportado", "=", req.params.idUsuario)
        .then((reportes) => {
          console.log(
            "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
            reportes
          );
          res.json(reportes);
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 98 ~ .then ~ error",
            error
          );
          res.json("error");
        });
    }
    if (req.params.opcion == 6) {
      Reporte_Publicacion.query()
        .withGraphJoined("ReporteUsuarioReporta.UsuarioRegistro")
        .where("ID_Usuario_Reportado", "=", req.params.idUsuario)
        .andWhereNot("Razon", "=", opcionesMapRazon.get("1"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("2"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("3"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("4"))
        .andWhereNot("Razon", "=", opcionesMapRazon.get("5"))
        .then((reportes) => {
          console.log(
            "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
            reportes
          );
          res.json(reportes);
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 118 ~ .then ~ error",
            error
          );
          res.json("error");
        });
    }
  }
};

exports.validarReportesUsuario = (req, res, next) => {
  req.body;
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 138 ~ req.body",
    req.body
  );
  let reportes = req.body.reportes.arrayReportes;
  let reportesOtros = req.body.reportes.arrayReportesOtro;
  let idUsuario = req.body.publicacion;
  let suma = 0;
  reportesOtros.forEach((reporte) => {
    suma += Number(reporte.Peso);
  });
  let newArray = [...reportes, ...reportesOtros];
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 162 ~ exports.validarReportes= ~ newArray.length",
    newArray.length
  );
  if (newArray.length == 0) {
    res.json("no items");
    return;
  }
  let promiseArray = [];

  newArray.forEach((promise) => {
    promiseArray.push(createPromiseReporte(promise));
  });

  Promise.all(promiseArray)
    .then(() => {
      Usuario.query()
        .findById(idUsuario)
        .then((usuarioFind) => {
          let peso = Number(usuarioFind.Reputacion) - Number(suma);
          if (peso <= -100) {
            peso = -100;
          }
          usuarioFind
            .$query()
            .patch({ Reputacion: peso })
            .then(() => {
              res.json("ok");
            })
            .catch((err) => {
              console.log(
                "🚀 ~ file: ModeradorController.js ~ line 186 ~ .then ~ err",
                err
              );
              next(err);
            });
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
            err
          );
          next(err);
        });
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
        err
      );
      next(err);
    });
};

exports.invalidarReportesUsuario = (req, res, next) => {
  req.body;
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 138 ~ req.body",
    req.body
  );
  let reportes = req.body.reportes.arrayReportes;
  let reportesOtros = req.body.reportes.arrayReportesOtro;
  let idUsuario = req.body.publicacion;
  let suma = 0;
  let newArray = [...reportes, ...reportesOtros];
  newArray.forEach((reporte) => {
    if (reporte.Peso == undefined) {
      let valor = opcionesMapPeso.get(reporte.Razon);
      suma += Number(valor);
    } else {
      suma += Number(reporte.Peso);
    }
  });
  console.log("🚀 ~ file: ModeradorController.js ~ line 226 ~ suma", suma);
  console.log(
    "🚀 ~ file: ModeradorController.js ~ line 162 ~ exports.validarReportes= ~ newArray.length",
    newArray.length
  );
  if (newArray.length == 0) {
    res.json("no items");
    return;
  }
  let promiseArray = [];

  newArray.forEach((promise) => {
    promiseArray.push(createPromiseReporte(promise));
  });

  Promise.all(promiseArray)
    .then(() => {
      Usuario.query()
        .findById(idUsuario)
        .then((usuario) => {
          let peso = Number(usuario.Reputacion) + Number(suma);
          if (peso >= 100) {
            peso = 100;
          }
          usuario
            .$query()
            .patch({ Reputacion: peso })
            .then(() => {
              res.json("ok");
            })
            .catch((err) => {
              console.log(
                "🚀 ~ file: ModeradorController.js ~ line 186 ~ .then ~ err",
                err
              );
              next(err);
            });
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
            err
          );
          next(err);
        });
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 190 ~ .then ~ err",
        err
      );
      next(err);
    });
};

exports.eliminarUsuario = (req, res, next) => {
  Usuario.query()
    .findById(req.body.idUsuario)
    // .select("publicacion.ID")
    .withGraphJoined(
      "[Publicaciones.[Mascota.[MascotasImagenes,MascotasProceso]],Protocolos.[Pasos]]",
      { minimize: true }
    )
    // .modifyGraph("Mascota", (builder) => {
    //   builder.select("mascota.ID");
    // })
    // .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
    //   builder.select("Ruta", "ID");
    // })
    // .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
    //   builder.select("Archivo");
    // })
    .then((usuarioFind) => {
      // console.log(
      //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
      //   PublicacionesReportadas
      // );
      // PublicacionesReportadas.Publicaciones[1];
      // Asi se accede a los pasos_mascota
      // let archivos = [];
      // // archivos.push("1.jpg");
      // archivos.push("2.jpg");
      // archivos.push("3.jpg");
      // archivos.push("4.jpg");
      // archivos.push("5.jpg");
      // archivos.push("6.pdf");
      // archivos.push("7.jpg");
      // archivos.push("8.jpg");
      // archivos.push("9.jpg");
      // archivos.push("10.jpg");
      // archivos.push("11.jpg");
      // archivos.push("12.png");
      // archivos.push("13.jpg");
      // archivos.push("14.jpg");
      // archivos.push("15.png");
      // archivos.push("16.pdf");
      // archivos.push("17.jpg");
      // archivos.push("18.png");
      // archivos.push("19.png");
      // archivos.push("20.jpg");
      // archivos.push("21.jpg");
      // archivos.push("22.jpg");
      // archivos.push("23.jpg");
      // archivos.push("24.jpg");
      // archivos.push("25.jpg");
      // archivos.push("26.jpg");
      // archivos.push("27.jpg");
      // archivos.push("28.jpg");
      // archivos.push("29.jpg");
      // archivos.push("30.docx");
      // archivos.push("31.pdf");
      // archivos.push("32.docx");
      // archivos.push("33.jpg");
      // archivos.push("34.pdf");
      // archivos.push("35.pdf");
      // archivos.push("36.pdf");
      // archivos.push("37.pdf");
      // archivos.push("38.pdf");

      // archivos = archivos.map((x) => "public\\prueba\\" + x);
      // let req = {
      //   deleteFilesPath: [],
      // };
      // req.deleteFilesPath = archivos;

      // let promises = deleteFiles(req);

      // console.log(promises);

      // console.log(archivos);
      // Promise.all(promises).then(() => console.log("ok"));
      //aqui empieza el codigo
      let registroID = usuarioFind.FK_Registro;
      console.log(
        "🚀 ~ file: pruebaContarDonaciones.js ~ line 229 ~ .then ~ PublicacionesReportadas.Publicaciones[1]",
        usuarioFind
      );
      // let req = {};
      req.deleteFilesPath = [];
      let arrayImagenesID = [];

      usuarioFind.Publicaciones.forEach((PublicacionUsuario) => {
        if (PublicacionUsuario.Mascota.length != 0) {
          let mascotasPublicacion = PublicacionUsuario.Mascota;
          mascotasPublicacion.forEach((mascota) => {
            console.log(
              "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
              mascota.MascotasImagenes
            );
            let arrayImagenes = mascota.MascotasImagenes.map(
              (x) => "public" + x.Ruta.replaceAll("\\", "/")
            );
            let arrayID = mascota.MascotasImagenes.map((x) => x.ID);
            arrayImagenesID = arrayImagenesID.concat(arrayID);
            let arrayArchivos = mascota.MascotasProceso.filter(
              (PasoArchivo) => PasoArchivo.Archivo != null
            );
            arrayArchivos = arrayArchivos.map((x) =>
              x.Archivo.replaceAll("\\", "/")
            );
            arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
            req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
            req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
          });
        }
      });
      if (usuarioFind.Protocolos.length != 0) {
        let ProtocolosUsuario = usuarioFind.Protocolos;
        ProtocolosUsuario.forEach((protocolo) => {
          let arrayArchivos = protocolo.Pasos.map((x) =>
            x.Archivo.replaceAll("\\", "/")
          );
          arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
          req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
        });
      }
      if (
        usuarioFind.Foto_Perfil != "/images/ImagenesPerfilUsuario/default.png"
      ) {
        req.deleteFilesPath.push(usuarioFind.Foto_Perfil);
      }

      usuarioFind
        .$query()
        .delete()
        .then(() => {
          let arrayPromises = [];
          arrayImagenesID.forEach((idImagen) => {
            arrayPromises.push(createPromiseEliminarImagen(idImagen));
          });
          let borrarArchivosPromises = deleteFiles(req);
          Promise.all(arrayPromises).then(() => {
            Promise.all(borrarArchivosPromises).then(() => {
              Registro.query()
                .deleteById(registroID)
                .then(() => {
                  console.log("Todo correcto");
                  res.json("ok");
                });
            });
          });
        });
      // usuarioFind
      //   .$query()
      //   .delete()
      //   .then(() => {

      console.log(
        "🚀 ~ file: pruebaContarDonaciones.js ~ line 287 ~ .then ~ arrayImagenesID",
        arrayImagenesID
      );
      //   });
      console.log(
        "🚀 ~ file: pruebaContarDonaciones.js ~ line 270 ~ .then ~ req.deleteFilesPath",
        req.deleteFilesPath
      );
    })
    .catch((err) => {
      console.log(
        "🚀 ~ file: ModeradorController.js ~ line 309 ~ .then ~ err",
        err
      );
      // next(err);
    });
};
//Reportes usuario
