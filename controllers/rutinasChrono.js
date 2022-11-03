const Imagenes = require("../models/Imagenes");
const Notificaciones = require("../models/Notificaciones");
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

exports.deleteUsuariosSinValidar = (fecha_exec) => {};

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
