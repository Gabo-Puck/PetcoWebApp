// const Metas = require("../models/Metas");
// const { sendNotificacion } = require("./NotificacionesController");

const Registro = require("../models/Registro");
const { decrypt, encrypt } = require("../utils/cryptoUtils/randomId");
const { sendMail } = require("../controllers/email");
const Reporte_Publicacion = require("../models/Reporte_Publicacion");
const Publicacion = require("../models/Publicacion");
const Usuario = require("../models/Usuario");
const Imagenes = require("../models/Imagenes");
const { deleteFiles } = require("../utils/multipartRequestHandle");
const Formulario = require("../models/Formulario");
const Protocolo = require("../models/Protocolo");
const {
  getTodayDateFormated,
  getDateFormated,
} = require("./NotificacionesController");
const Mascota = require("../models/Mascota");
const Pasos_Mascota = require("../models/Pasos_Mascota");

// // Metas.query()
// //   .withGraphJoined("[MetasDonaciones,Mascota]")
// //   .findById(34)
// //   .then((Meta) => {
// //     // console.log(Meta);
// //     let acumulado = 0;
// //     let cantidad = Meta.Cantidad;
// //     Meta.MetasDonaciones.forEach((donaciones) => {
// //       acumulado += donaciones.Cantidad;
// //     });
// //     // acumulado += 700;
// //     // console.log("Acumulado:", acumulado);
// //     if (acumulado >= cantidad) {
// //       Meta.$query()
// //         .patch({ Completado: 1 })
// //         .then(() => {
// //           let descripcion = `¡Felicidades! la meta de la mascota: "${Meta.Mascota.Nombre} se ha completado"`;
// //           let origen = "aqui va la url de las metas";
// //           let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
// //           sendNotificacion(descripcion, origen, usuario);
// //         });
// //     }
// //   });
// // requestPassChange = (req, res, next) => {
// // };
// Registro.query()
//   .withGraphJoined("RegistroUsuario")
//   .findOne({ Correo: "skyshcoke@gmail.com" })
//   .then((usuarioCorreo) => {
//     console.log(usuarioCorreo);
//     if (usuarioCorreo === undefined) {
//       console.log("No correo encontrado");
//     } else if (usuarioCorreo.RegistroUsuario === null) {
//       console.log("No cuenta validada");
//     } else {
//       let idEncrypted = encrypt(usuarioCorreo.ID.toString());
//       if (idEncrypted == "error") {
//         console.log("error");
//       } else {
//         res.registroPatch.Correo = idEncrypted;
//         console.log("id enc:", idEncrypted);
//         let idDecrypted = decrypt(idEncrypted);
//         console.log("id dec:", idDecrypted);
//         console.log("link mandado");
//       }
//     }
//   });

// Publicacion.query()
//   .withGraphJoined("PublicacionReporte").se
//   .whereNotNull("PublicacionReporte.ID_Publicacion")
//   .then((publicaciones) => {
//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 59 ~ Publicacion.query ~ publicaciones",
//       publicaciones
//     );
//   });

// Publicacion.query()
//   // .where("publicacion.ID", "=", req.params.idP)
//   .select(
//     "publicacion.*",
//     Publicacion.relatedQuery("PublicacionReporte").count().as("numeroReportes")
//   )
//   .having("numeroReportes", ">", 0)
//   // .where("numeroReportes", ">", 0)
//   .orderBy("numeroReportes", "DESC")
//   .debug()
//   // .whereNot("numeroReportes", "=", 0)
//   .then((countLikes) => {
//     console.log(countLikes);
//     // resolve(countLikes);
//   });

// Reporte_Publicacion.query()
//   .withGraphJoined("ReporteUsuarioReporta")
//   .where("Razon", "=", "Spam")
//   .then((res) => {
//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
//       res
//     );
//   });

// Publicacion.query()
//   .findById(48)
//   .select("publicacion.ID")
//   .withGraphJoined("Mascota.[MascotasImagenes, MascotasProceso]")
//   .modifyGraph("Mascota", (builder) => {
//     builder.select("mascota.ID");
//   })
//   .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
//     builder.select("Ruta", "ID");
//   })
//   .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
//     builder.select("Archivo");
//   })
//   .then((PublicacionesReportadas) => {
//     // console.log(
//     //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
//     //   PublicacionesReportadas
//     // );
//     let arrayArchivosEliminar = [];
//     let idImagenes = [];
//     PublicacionesReportadas.Mascota.forEach((mascota) => {
//       console.log(
//         "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
//         mascota.MascotasImagenes
//       );
//       let arrayImagenes = mascota.MascotasImagenes.map(
//         (x) => "public" + x.Ruta
//       );
//       let arrayImagenesID = mascota.MascotasImagenes.map((x) => x.ID);
//       idImagenes = idImagenes.concat(arrayImagenesID);
//       let arrayArchivos = mascota.MascotasProceso.map((x) => x.Archivo);
//       arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
//       arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
//       arrayArchivosEliminar = arrayArchivosEliminar.concat(arrayImagenes);
//       arrayArchivosEliminar = arrayArchivosEliminar.concat(arrayArchivos);
//     });
//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 113 ~ .then ~ idImagenes",
//       idImagenes
//     );
//     // console.log(
//     //   "🚀 ~ file: ModeradorController.js ~ line 281 ~ .then ~ arrayArchivosEliminar",
//     //   arrayArchivosEliminar
//     // );

//     // resolve(countLikes);
//   });

// Usuario.query()
//   // .where("publicacion.ID", "=", req.params.idP)
//   .withGraphJoined("[ReportesRecibidos,UsuarioRegistro]")
//   .modifyGraph("UsuarioRegistro", (builder) => {
//     builder.select("nombre");
//   })
//   .select(
//     "usuario.*",
//     Usuario.relatedQuery("ReportesRecibidos")
//       .whereNull("ReportesRecibidos.ID_Publicacion")
//       .count()
//       .as("numeroReportes")
//   )
//   .whereNull("ReportesRecibidos.ID_Publicacion")
//   .having("numeroReportes", ">", 0)
//   // .where("numeroReportes", ">", 0)
//   .orderBy("numeroReportes", "DESC")
//   .debug()
//   // .whereNot("numeroReportes", "=", 0)
//   .then((UsuariosReportados) => {
//     console.log(UsuariosReportados);
//     // res.render("Moderador/verPublicacionesReportadas.ejs", {
//     //   Tipo: req.session.IdSession,
//     //   PublicacionesReportadas: PublicacionesReportadas,
//     // });
//     // resolve(countLikes);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Publicacion.query()
//   .withGraphJoined("Mascota.[MascotasImagenes, MascotasProceso]")
//   .findById(47)
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
//         publicacion.Mascota.MascotaImagenes
//       );
//       console.log(
//         "🚀 ~ file: ModeradorController.js ~ line 244 ~ .then ~ p",
//         publicacion.Mascota.MascotasProceso
//       );
//       // res.json("ok");
//     } else {
//       // res.json("not found");
//     }
//   });

// Reporte_Publicacion.query()
//   .whereNotNull("ID_Publicacion")
//   .then((reportes) => {
//     console.log(reportes);
//   });

// Usuario.query()
//   .findById(30)
//   // .select("publicacion.ID")
//   .withGraphJoined(
//     "[Publicaciones.[Mascota.[MascotasImagenes,MascotasProceso]],Protocolos.[Pasos]]",
//     { minimize: true }
//   )
//   // .modifyGraph("Mascota", (builder) => {
//   //   builder.select("mascota.ID");
//   // })
//   // .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
//   //   builder.select("Ruta", "ID");
//   // })
//   // .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
//   //   builder.select("Archivo");
//   // })
//   .then((usuarioFind) => {
//     // console.log(
//     //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
//     //   PublicacionesReportadas
//     // );
//     // PublicacionesReportadas.Publicaciones[1];
//     // Asi se accede a los pasos_mascota
//     // let archivos = [];
//     // // archivos.push("1.jpg");
//     // archivos.push("2.jpg");
//     // archivos.push("3.jpg");
//     // archivos.push("4.jpg");
//     // archivos.push("5.jpg");
//     // archivos.push("6.pdf");
//     // archivos.push("7.jpg");
//     // archivos.push("8.jpg");
//     // archivos.push("9.jpg");
//     // archivos.push("10.jpg");
//     // archivos.push("11.jpg");
//     // archivos.push("12.png");
//     // archivos.push("13.jpg");
//     // archivos.push("14.jpg");
//     // archivos.push("15.png");
//     // archivos.push("16.pdf");
//     // archivos.push("17.jpg");
//     // archivos.push("18.png");
//     // archivos.push("19.png");
//     // archivos.push("20.jpg");
//     // archivos.push("21.jpg");
//     // archivos.push("22.jpg");
//     // archivos.push("23.jpg");
//     // archivos.push("24.jpg");
//     // archivos.push("25.jpg");
//     // archivos.push("26.jpg");
//     // archivos.push("27.jpg");
//     // archivos.push("28.jpg");
//     // archivos.push("29.jpg");
//     // archivos.push("30.docx");
//     // archivos.push("31.pdf");
//     // archivos.push("32.docx");
//     // archivos.push("33.jpg");
//     // archivos.push("34.pdf");
//     // archivos.push("35.pdf");
//     // archivos.push("36.pdf");
//     // archivos.push("37.pdf");
//     // archivos.push("38.pdf");

//     archivos = archivos.map((x) => "public\\prueba\\" + x);
//     let req = {
//       deleteFilesPath: [],
//     };
//     req.deleteFilesPath = archivos;

//     let promises = deleteFiles(req);

//     // console.log(promises);

//     // console.log(archivos);
//     Promise.all(promises).then(() => console.log("ok"));
//     //aqui empieza el codigo
//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 229 ~ .then ~ PublicacionesReportadas.Publicaciones[1]",
//       usuarioFind
//     );
//     let req = {};
//     req.deleteFilesPath = [];
//     let arrayImagenesID = [];

//     usuarioFind.Publicaciones.forEach((PublicacionUsuario) => {
//       if (PublicacionUsuario.Mascota.length != 0) {
//         let mascotasPublicacion = PublicacionUsuario.Mascota;
//         mascotasPublicacion.forEach((mascota) => {
//           console.log(
//             "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
//             mascota.MascotasImagenes
//           );
//           let arrayImagenes = mascota.MascotasImagenes.map(
//             (x) => "public" + x.Ruta.replaceAll("\\", "/")
//           );
//           let arrayID = mascota.MascotasImagenes.map((x) => x.ID);
//           arrayImagenesID = arrayImagenesID.concat(arrayID);
//           let arrayArchivos = mascota.MascotasProceso.filter(
//             (PasoArchivo) => PasoArchivo.Archivo != null
//           );
//           arrayArchivos = arrayArchivos.map((x) =>
//             x.Archivo.replaceAll("\\", "/")
//           );
//           arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
//           req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
//           req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
//         });
//       }
//     });
//     if (usuarioFind.Protocolos.length != 0) {
//       let ProtocolosUsuario = usuarioFind.Protocolos;
//       ProtocolosUsuario.forEach((protocolo) => {
//         let arrayArchivos = protocolo.Pasos.map((x) =>
//           x.Archivo.replaceAll("\\", "/")
//         );
//         arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
//         req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
//       });
//     }
//     if (
//       usuarioFind.Foto_Perfil != "/images/ImagenesPerfilUsuario/default.png"
//     ) {
//       req.deleteFilesPath.push(usuarioFind.Foto_Perfil);
//     }

//     usuarioFind
//       .$query()
//       .delete()
//       .then(() => {
//         let arrayPromises = [];
//         arrayImagenesID.forEach((idImagen) => {
//           arrayPromises.push(createPromiseEliminarImagen(idImagen));
//         });
//         let borrarArchivosPromises = deleteFiles(req);
//         Promise.all(arrayPromises).then(() => {
//           Promise.all(borrarArchivosPromises).then(() => {
//             console.log("Todo correcto");
//           });
//         });
//       });
//     // usuarioFind
//     //   .$query()
//     //   .delete()
//     //   .then(() => {

//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 287 ~ .then ~ arrayImagenesID",
//       arrayImagenesID
//     );
//     //   });
//     console.log(
//       "🚀 ~ file: pruebaContarDonaciones.js ~ line 270 ~ .then ~ req.deleteFilesPath",
//       req.deleteFilesPath
//     );
//   })
//   .catch((err) => {
//     console.log(
//       "🚀 ~ file: ModeradorController.js ~ line 309 ~ .then ~ err",
//       err
//     );
//     // next(err);
//   });

// function createPromiseEliminarImagen(id) {
//   // console.log(
//   //   "🚀 ~ file: ModeradorController.js ~ line 222 ~ createPromiseReporte ~ reporte",
//   //   reporte
//   // );
//   return new Promise((resolve, reject) => {
//     resolve(
//       Imagenes.query()
//         .findById(id)
//         .delete()
//         .then(() => {})
//     );
//   });
// }

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// let dateHoy = new Date(2003, 9, 1);
// console.log(
//   "🚀 ~ file: pruebaContarDonaciones.js ~ line 391 ~ dateHoy",
//   dateHoy
// );
// let pasos = [];

// let paso1 = {
//   t: "Paso 1",
//   dias: 1,
// };

// pasos.push(paso1);

// let paso2 = {
//   t: "Paso 2",
//   dias: 5,
// };

// pasos.push(paso2);

// let paso3 = {
//   t: "Paso 3",
//   dias: 2,
// };
// pasos.push(paso3);

// let paso4 = {
//   t: "Paso 4",
//   dias: 3,
// };
// pasos.push(paso4);
// console.log("🚀 ~ file: pruebaContarDonaciones.js ~ line 422 ~ pasos", pasos);
// let fechaAcumulador = dateHoy;

// console.log(
//   "🚀 ~ file: pruebaContarDonaciones.js ~ line 431 ~ dateHoy.toString()",
//   dateHoy.toLocaleDateString()
// );
// pasos.forEach((paso) => {
//   fechaAcumulador = fechaAcumulador.addDays(paso.dias);
//   // console.log(
//   //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 432 ~ pasos.forEach ~ dateHoy",
//   //   dateHoy
//   // );
//   console.log(
//     "El",
//     paso.t,
//     "termina el: ",
//     fechaAcumulador.toLocaleDateString("es-MX")
//   );
// });
// console.log(
//   "🚀 ~ file: pruebaContarDonaciones.js ~ line 431 ~ dateHoy.toString()",
//   dateHoy.toLocaleDateString()
// );

// let Fecha_Generacion = getTodayDateFormated();
// Mascota.query()
//   .withGraphJoined("MascotasProceso.[Paso]")
//   .findById(81)
//   // .patchAndFetch({ Fecha_Ultima_Solicitud: Fecha_Generacion })
//   .then((Mascota) => {
//     let fecha = new Date(Fecha_Generacion);
//     Mascota.MascotasProceso.forEach((paso) => {
//       fecha = fecha.addDays(paso.Paso.DiasEstimados);
//       console.log(
//         "🚀 ~ file: pruebaContarDonaciones.js ~ line 462 ~ Mascota.MascotasProceso.forEach ~ fecha",
//         getDateFormated(fecha)
//       );
//     });
//   });

Pasos_Mascota.query()
  .withGraphJoined("Mascota.[MascotasSolicitudes]")
  .findOne({
    "paso_mascota.ID": 144,
    "Mascota:MascotasSolicitudes.Estado": 2,
  })
  .then((PasoFind) => {
    console.log(
      "🚀 ~ file: pruebaContarDonaciones.js ~ line 478 ~ .then ~ PasoFind",
      PasoFind.Mascota
    );
    PasoFind.Mascota.MascotasSolicitudes[0]
      .$query()
      .patch({ Estado: 1 })
      .then(() => {
        console.log("XD");
      });
  });
// Formulario.query()
//   .where("formulario.ID_Usuario", "=", 4)
//   .then((Formularios) => {
//     Protocolo.query()
//       .withGraphJoined("Pasos.[Mascota]")
//       // .select(
//       //   "protocolos.*",
//       //   Protocolo.relatedQuery("Pasos.Mascota").count().as("numeroMascotas")
//       // )
//       .where("protocolos.ID_Usuario", "=", 4)
//       .then((Protocolos) => {
//         // res.render("Formulario/FormDashboard.ejs", {
//         //   Elemento: Formularios,
//         //   Elemento2: Protocolos,
//         //   Tipo: req.session.Tipo,
//         // });
//         console.log(
//           "🚀 ~ file: pruebaContarDonaciones.js ~ line 396 ~ .then ~ Protocolos",
//           Protocolos[0].Pasos[0]
//         );
//         console.log(
//           "🚀 ~ file: pruebaContarDonaciones.js ~ line 398 ~ .then ~ Formularios",
//           Formularios
//         );
//       });
//   });
