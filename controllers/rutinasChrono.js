const Imagenes = require("../models/Imagenes");
const Mascota = require("../models/Mascota");
const Notificaciones = require("../models/Notificaciones");
const Pasos_Mascota = require("../models/Pasos_Mascota");
const Registro = require("../models/Registro");
const Usuario = require("../models/Usuario");
const { deleteFiles } = require("../utils/multipartRequestHandle");
const { getDateFormated } = require("./NotificacionesController");

Date.prototype.substractMonths = function (months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() - months);
  return date;
};

exports.deleteNotificacionesMeses = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  date2 = date2.substractMonths(2);
  console.log(date2);
  Notificaciones.query()
    .where("Fecha_Generacion", "<", date2)
    .then((notificacionesBorrar) => {
      console.log(
        `Notificaciones a borrar a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      console.log(`Fecha de ejecución ${fecha}`);
      console.log(notificacionesBorrar);
      let promises = [];
      notificacionesBorrar.forEach((notificacion) => {
        promises.push(promisesBorrarNotificacion(notificacion));
      });
      Promise.all(promises).then(() => {
        console.log(`${notificacionesBorrar.length} notificaciones borradas`);
      });
    });
};

function promisesBorrarNotificacion(notificacion) {
  return new Promise((resolve, reject) => {
    resolve(notificacion.$query().delete());
  });
}

exports.deleteUsuarioInactividad = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  date2 = date2.substractMonths(12);
  console.log(
    date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
  );

  Usuario.query()
    .withGraphJoined(
      "[Publicaciones.[Mascota.[MascotasImagenes,MascotasProceso]],Protocolos.[Pasos]]",
      { minimize: true }
    )
    .where("usuario.UltimaConexion", "<", date2)
    .then((usuariosEliminar) => {
      // console.log(usuariosEliminar);
      console.log(
        `Usuarios a borrar a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      console.log(`Fecha de ejecución ${fecha}`);
      console.log(usuariosEliminar);
      let usuariosPromises = [];
      usuariosEliminar.forEach((usuario) => {
        usuariosPromises.push(deleteUsuarioPromise(usuario));
      });
      Promise.all(usuariosPromises).then(() => {
        console.log(`Se han eliminado ${usuariosEliminar.length} usuarios`);
      });
    });
};

exports.deleteUsuariosSinValidar = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  date2 = date2.substractMonths(5);
  console.log(
    date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
  );

  Registro.query()
    .withGraphJoined("RegistroUsuario")
    .where("Fecha_Registro", "<", date2)
    .then((registrosEliminar) => {
      // console.log(usuariosEliminar);

      console.log(
        `Usuarios sin validar a borrar a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      let usuariosEliminarArray = [];
      registrosEliminar.forEach((usuario) => {
        if (usuario.RegistroUsuario == null) {
          usuariosEliminarArray.push(usuario);
        }
      });
      console.log(`Fecha de ejecución ${fecha}`);

      console.log(usuariosEliminarArray);
      let registrosPromises = [];
      registrosEliminar.forEach((registro) => {
        registrosPromises.push(deleteRegistroPromise(registro));
      });
      Promise.all(registrosPromises).then(() => {
        console.log(`Se han eliminado ${registrosEliminar.length} usuarios`);
      });
    });
};

exports.deleteMascotasInactivas = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  date2 = date2.substractMonths(4);
  console.log(
    date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
  );

  Mascota.query()
    .where("Fecha_Ultima_Solicitud", "<", date2)
    .withGraphJoined("[MascotasImagenes,MascotasProceso]")
    .then((MascotasEliminar) => {
      console.log(
        `Mascotas inactivas a borrar a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      let promisesMascotas = [];
      MascotasEliminar.forEach((mascota) => {
        promisesMascotas.push(deleteMascotaPromise(mascota));
      });
      console.log(`Fecha de ejecución ${fecha}`);
      console.log(MascotasEliminar);
      Promise.all(promisesMascotas).then(() => {
        console.log(`Se han eliminado ${MascotasEliminar.length} mascotas`);
      });
    });
};

exports.deleteProcesoPasoFueraTiempo = (fecha_exec) => {
  let fecha = getDateFormated(fecha_exec);
  let date2 = new Date(fecha);
  // date2 = date2.substractMonths(5);
  console.log(
    date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
  );

  Pasos_Mascota.query()
    .where("Fecha_Limite", "<", date2)
    .andWhere("Completado", "<", 3)
    .andWhere("Mascota:MascotasSolicitudes.Estado", "=", 1)
    .withGraphJoined("[Mascota.[MascotasSolicitudes]]")
    .then((PasosIncompletos) => {
      console.log(
        `Pasos fuerea de tiempo a resetear a partir de la fecha: ${date2.toLocaleDateString(
          "es-MX"
        )} ${date2.toLocaleTimeString("es-MX")}`
      );
      console.log(`Fecha de ejecución ${fecha}`);
      console.log(PasosIncompletos);
      let promisesPasosIncompletos = [];
      let promisesEliminarsolicitudes = [];
      PasosIncompletos.forEach((PasoIncompleto) => {
        promisesPasosIncompletos.push(
          createPromisesPasoDefault(PasoIncompleto)
        );
        promisesEliminarsolicitudes.push(
          deleteSolicitudPromise(PasoIncompleto.Mascota)
        );
      });
      Promise.all(promisesEliminarsolicitudes).then(() => {
        Promise.all(promisesPasosIncompletos).then(() => {
          console.log(`Se han reseteado ${PasosIncompletos.length} pasos`);
        });
      });
    });
};

function deleteSolicitudPromise(mascota) {
  return new Promise((resolve, reject) => {
    resolve(
      mascota.MascotasSolicitudes[0]
        .$query()
        .delete()
        .then(() => {
          resolve("ok");
        })
    );
  });
}

function createPromisesPasoDefault(paso) {
  return new Promise((resolve, reject) => {
    Pasos_Mascota.query()
      .where("ID_Mascota", "=", paso.ID_Mascota)
      .then((pasos) => {
        // let arrayArchivos = [];
        let arrayPromises = [];
        let req = {};
        req.deleteFilesPath = [];
        pasos.forEach((pasoEncontrado) => {
          if (pasoEncontrado.Archivo != null) {
            req.deleteFilesPath.push(
              pasoEncontrado.Archivo.replaceAll("\\", "/")
            );
          }
          arrayPromises.push(patchPasosDefaultPromise(pasoEncontrado));
        });

        Promise.all(deleteFiles(req)).then(() => {
          Promise.all(arrayPromises).then(() => {
            resolve("ok");
          });
        });
      });
  });
}

function patchPasosDefaultPromise(PasoProceso) {
  let valueCompletado = 0;
  if (PasoProceso.ID_Paso == 1) {
    valueCompletado = 3;
  }
  return new Promise((resolve, reject) => {
    resolve(
      PasoProceso.$query()
        .patch({
          Completado: valueCompletado,
          Archivo: null,
          Fecha_Limite: null,
        })
        .then(() => {})
    );
  });
}

function deleteMascotaPromise(mascota) {
  return new Promise((resolve, reject) => {
    let req = {};
    req.deleteFilesPath = [];
    let arrayImagenesID = [];
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
    arrayArchivos = arrayArchivos.map((x) => x.Archivo.replaceAll("\\", "/"));
    arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
    req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
    req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
    let arrayPromises = [];
    arrayID.forEach((id) => {
      arrayPromises.push(createPromiseEliminarImagen(id));
    });
    mascota
      .$query()
      .delete()
      .then(() => {
        Promise.all(deleteFiles(req)).then(() => {
          Promise.all(arrayPromises).then(() => {
            resolve("ok");
          });
        });
      });
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

function deleteRegistroPromise(registro) {
  return new Promise((resolve, reject) => {
    let documentos = registro.Documento_Identidad.split(";");
    let req = {
      deleteFilesPath: [],
    };
    documentos.forEach((documento) => {
      let pathCorrected = "public/" + documento;
      if (pathCorrected != "public/") {
        req.deleteFilesPath.push(pathCorrected);
      }
    });
    registro
      .$query()
      .delete()
      .then(() => {
        Promise.all(deleteFiles(req)).then(() => {
          resolve("ok");
        });
      });
  });
}

function deleteUsuarioPromise(usuarioFind) {
  return new Promise((resolve, reject) => {
    let registroID = usuarioFind.FK_Registro;
    console.log(
      "🚀 ~ file: pruebaContarDonaciones.js ~ line 229 ~ .then ~ PublicacionesReportadas.Publicaciones[1]",
      usuarioFind
    );
    let req = {};
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
              .findById(registroID)
              .then((registroFind) => {
                let promisesRegistro = [];
                let documentos = registroFind.Documento_Identidad.split(";");
                let req = {
                  deleteFilesPath: [],
                };
                documentos.forEach((documento) => {
                  let pathCorrected = "public/" + documento;
                  if (pathCorrected != "public/") {
                    req.deleteFilesPath.push(pathCorrected);
                  }
                });
                console.log(req.deleteFilesPath);
                let arrayPromisesBorrar = deleteFiles(req);
                Promise.all(arrayPromisesBorrar).then(() => {
                  console.log("Todo correcto");
                  registroFind
                    .$query()
                    .delete()
                    .then(() => {
                      resolve("ok");
                    });
                });
              });
            //
          });
        });
      });
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
