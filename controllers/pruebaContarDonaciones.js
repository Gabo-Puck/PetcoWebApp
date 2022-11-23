// // const Metas = require("../models/Metas");
// // const { sendNotificacion } = require("./NotificacionesController");

const Mascota = require("../models/Mascota");
const Solicitudes = require("../models/Solicitudes");

// const Registro = require("../models/Registro");
// const { decrypt, encrypt } = require("../utils/cryptoUtils/randomId");
// const { sendMail, sendEmailAviso } = require("../controllers/email");
// const Reporte_Publicacion = require("../models/Reporte_Publicacion");
// const Publicacion = require("../models/Publicacion");
// const Usuario = require("../models/Usuario");
// const Imagenes = require("../models/Imagenes");
// const { deleteFiles } = require("../utils/multipartRequestHandle");
// const Formulario = require("../models/Formulario");
// const Protocolo = require("../models/Protocolo");
// const {
//   getTodayDateFormated,
//   getDateFormated,
// } = require("./NotificacionesController");
// const Mascota = require("../models/Mascota");
// const Pasos_Mascota = require("../models/Pasos_Mascota");
// const Notificaciones = require("../models/Notificaciones");
// const Paso = require("../models/Paso");
// const { validationResult, checkSchema, check } = require("express-validator");
// // // Metas.query()
// // //   .withGraphJoined("[MetasDonaciones,Mascota]")
// // //   .findById(34)
// // //   .then((Meta) => {
// // //     // console.log(Meta);
// // //     let acumulado = 0;
// // //     let cantidad = Meta.Cantidad;
// // //     Meta.MetasDonaciones.forEach((donaciones) => {
// // //       acumulado += donaciones.Cantidad;
// // //     });
// // //     // acumulado += 700;
// // //     // console.log("Acumulado:", acumulado);
// // //     if (acumulado >= cantidad) {
// // //       Meta.$query()
// // //         .patch({ Completado: 1 })
// // //         .then(() => {
// // //           let descripcion = `¡Felicidades! la meta de la mascota: "${Meta.Mascota.Nombre} se ha completado"`;
// // //           let origen = "aqui va la url de las metas";
// // //           let usuario = Meta.MetasDonaciones[0].ID_Organizacion;
// // //           sendNotificacion(descripcion, origen, usuario);
// // //         });
// // //     }
// // //   });
// // // requestPassChange = (req, res, next) => {
// // // };
// // Registro.query()
// //   .withGraphJoined("RegistroUsuario")
// //   .findOne({ Correo: "skyshcoke@gmail.com" })
// //   .then((usuarioCorreo) => {
// //     console.log(usuarioCorreo);
// //     if (usuarioCorreo === undefined) {
// //       console.log("No correo encontrado");
// //     } else if (usuarioCorreo.RegistroUsuario === null) {
// //       console.log("No cuenta validada");
// //     } else {
// //       let idEncrypted = encrypt(usuarioCorreo.ID.toString());
// //       if (idEncrypted == "error") {
// //         console.log("error");
// //       } else {
// //         res.registroPatch.Correo = idEncrypted;
// //         console.log("id enc:", idEncrypted);
// //         let idDecrypted = decrypt(idEncrypted);
// //         console.log("id dec:", idDecrypted);
// //         console.log("link mandado");
// //       }
// //     }
// //   });

// // Publicacion.query()
// //   .withGraphJoined("PublicacionReporte").se
// //   .whereNotNull("PublicacionReporte.ID_Publicacion")
// //   .then((publicaciones) => {
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 59 ~ Publicacion.query ~ publicaciones",
// //       publicaciones
// //     );
// //   });

// // Publicacion.query()
// //   // .where("publicacion.ID", "=", req.params.idP)
// //   .select(
// //     "publicacion.*",
// //     Publicacion.relatedQuery("PublicacionReporte").count().as("numeroReportes")
// //   )
// //   .having("numeroReportes", ">", 0)
// //   // .where("numeroReportes", ">", 0)
// //   .orderBy("numeroReportes", "DESC")
// //   .debug()
// //   // .whereNot("numeroReportes", "=", 0)
// //   .then((countLikes) => {
// //     console.log(countLikes);
// //     // resolve(countLikes);
// //   });

// // Reporte_Publicacion.query()
// //   .withGraphJoined("ReporteUsuarioReporta")
// //   .where("Razon", "=", "Spam")
// //   .then((res) => {
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 85 ~ Reporte_Publicacion.query ~ res",
// //       res
// //     );
// //   });

// // Publicacion.query()
// //   .findById(48)
// //   .select("publicacion.ID")
// //   .withGraphJoined("Mascota.[MascotasImagenes, MascotasProceso]")
// //   .modifyGraph("Mascota", (builder) => {
// //     builder.select("mascota.ID");
// //   })
// //   .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
// //     builder.select("Ruta", "ID");
// //   })
// //   .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
// //     builder.select("Archivo");
// //   })
// //   .then((PublicacionesReportadas) => {
// //     // console.log(
// //     //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
// //     //   PublicacionesReportadas
// //     // );
// //     let arrayArchivosEliminar = [];
// //     let idImagenes = [];
// //     PublicacionesReportadas.Mascota.forEach((mascota) => {
// //       console.log(
// //         "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
// //         mascota.MascotasImagenes
// //       );
// //       let arrayImagenes = mascota.MascotasImagenes.map(
// //         (x) => "public" + x.Ruta
// //       );
// //       let arrayImagenesID = mascota.MascotasImagenes.map((x) => x.ID);
// //       idImagenes = idImagenes.concat(arrayImagenesID);
// //       let arrayArchivos = mascota.MascotasProceso.map((x) => x.Archivo);
// //       arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
// //       arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
// //       arrayArchivosEliminar = arrayArchivosEliminar.concat(arrayImagenes);
// //       arrayArchivosEliminar = arrayArchivosEliminar.concat(arrayArchivos);
// //     });
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 113 ~ .then ~ idImagenes",
// //       idImagenes
// //     );
// //     // console.log(
// //     //   "🚀 ~ file: ModeradorController.js ~ line 281 ~ .then ~ arrayArchivosEliminar",
// //     //   arrayArchivosEliminar
// //     // );

// //     // resolve(countLikes);
// //   });

// // Usuario.query()
// //   // .where("publicacion.ID", "=", req.params.idP)
// //   .withGraphJoined("[ReportesRecibidos,UsuarioRegistro]")
// //   .modifyGraph("UsuarioRegistro", (builder) => {
// //     builder.select("nombre");
// //   })
// //   .select(
// //     "usuario.*",
// //     Usuario.relatedQuery("ReportesRecibidos")
// //       .whereNull("ReportesRecibidos.ID_Publicacion")
// //       .count()
// //       .as("numeroReportes")
// //   )
// //   .whereNull("ReportesRecibidos.ID_Publicacion")
// //   .having("numeroReportes", ">", 0)
// //   // .where("numeroReportes", ">", 0)
// //   .orderBy("numeroReportes", "DESC")
// //   .debug()
// //   // .whereNot("numeroReportes", "=", 0)
// //   .then((UsuariosReportados) => {
// //     console.log(UsuariosReportados);
// //     // res.render("Moderador/verPublicacionesReportadas.ejs", {
// //     //   Tipo: req.session.IdSession,
// //     //   PublicacionesReportadas: PublicacionesReportadas,
// //     // });
// //     // resolve(countLikes);
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// // Publicacion.query()
// //   .withGraphJoined("Mascota.[MascotasImagenes, MascotasProceso]")
// //   .findById(47)
// //   .then((publicacion) => {
// //     if (publicacion) {
// //       console.log(
// //         "🚀 ~ file: ModeradorController.js ~ line 241 ~ .then ~ p",
// //         publicacion
// //       );
// //       console.log(
// //         "🚀 ~ file: ModeradorController.js ~ line 242 ~ .then ~ p",
// //         publicacion.Mascota
// //       );
// //       console.log(
// //         "🚀 ~ file: ModeradorController.js ~ line 243 ~ .then ~ p",
// //         publicacion.Mascota.MascotaImagenes
// //       );
// //       console.log(
// //         "🚀 ~ file: ModeradorController.js ~ line 244 ~ .then ~ p",
// //         publicacion.Mascota.MascotasProceso
// //       );
// //       // res.json("ok");
// //     } else {
// //       // res.json("not found");
// //     }
// //   });

// // Reporte_Publicacion.query()
// //   .whereNotNull("ID_Publicacion")
// //   .then((reportes) => {
// //     console.log(reportes);
// //   });

// // Usuario.query()
// //   .findById(30)
// //   // .select("publicacion.ID")
// //   .withGraphJoined(
// //     "[Publicaciones.[Mascota.[MascotasImagenes,MascotasProceso]],Protocolos.[Pasos]]",
// //     { minimize: true }
// //   )
// //   // .modifyGraph("Mascota", (builder) => {
// //   //   builder.select("mascota.ID");
// //   // })
// //   // .modifyGraph("Mascota.[MascotasImagenes]", (builder) => {
// //   //   builder.select("Ruta", "ID");
// //   // })
// //   // .modifyGraph("Mascota.[MascotasProceso]", (builder) => {
// //   //   builder.select("Archivo");
// //   // })
// //   .then((usuarioFind) => {
// //     // console.log(
// //     //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 108 ~ .then ~ PublicacionesReportadas.Mascota[0].MascotaImagenes",
// //     //   PublicacionesReportadas
// //     // );
// //     // PublicacionesReportadas.Publicaciones[1];
// //     // Asi se accede a los pasos_mascota
// //     // let archivos = [];
// //     // // archivos.push("1.jpg");
// //     // archivos.push("2.jpg");
// //     // archivos.push("3.jpg");
// //     // archivos.push("4.jpg");
// //     // archivos.push("5.jpg");
// //     // archivos.push("6.pdf");
// //     // archivos.push("7.jpg");
// //     // archivos.push("8.jpg");
// //     // archivos.push("9.jpg");
// //     // archivos.push("10.jpg");
// //     // archivos.push("11.jpg");
// //     // archivos.push("12.png");
// //     // archivos.push("13.jpg");
// //     // archivos.push("14.jpg");
// //     // archivos.push("15.png");
// //     // archivos.push("16.pdf");
// //     // archivos.push("17.jpg");
// //     // archivos.push("18.png");
// //     // archivos.push("19.png");
// //     // archivos.push("20.jpg");
// //     // archivos.push("21.jpg");
// //     // archivos.push("22.jpg");
// //     // archivos.push("23.jpg");
// //     // archivos.push("24.jpg");
// //     // archivos.push("25.jpg");
// //     // archivos.push("26.jpg");
// //     // archivos.push("27.jpg");
// //     // archivos.push("28.jpg");
// //     // archivos.push("29.jpg");
// //     // archivos.push("30.docx");
// //     // archivos.push("31.pdf");
// //     // archivos.push("32.docx");
// //     // archivos.push("33.jpg");
// //     // archivos.push("34.pdf");
// //     // archivos.push("35.pdf");
// //     // archivos.push("36.pdf");
// //     // archivos.push("37.pdf");
// //     // archivos.push("38.pdf");

// //     archivos = archivos.map((x) => "public\\prueba\\" + x);
// //     let req = {
// //       deleteFilesPath: [],
// //     };
// //     req.deleteFilesPath = archivos;

// //     let promises = deleteFiles(req);

// //     // console.log(promises);

// //     // console.log(archivos);
// //     Promise.all(promises).then(() => console.log("ok"));
// //     //aqui empieza el codigo
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 229 ~ .then ~ PublicacionesReportadas.Publicaciones[1]",
// //       usuarioFind
// //     );
// //     let req = {};
// //     req.deleteFilesPath = [];
// //     let arrayImagenesID = [];

// //     usuarioFind.Publicaciones.forEach((PublicacionUsuario) => {
// //       if (PublicacionUsuario.Mascota.length != 0) {
// //         let mascotasPublicacion = PublicacionUsuario.Mascota;
// //         mascotasPublicacion.forEach((mascota) => {
// //           console.log(
// //             "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
// //             mascota.MascotasImagenes
// //           );
// //           let arrayImagenes = mascota.MascotasImagenes.map(
// //             (x) => "public" + x.Ruta.replaceAll("\\", "/")
// //           );
// //           let arrayID = mascota.MascotasImagenes.map((x) => x.ID);
// //           arrayImagenesID = arrayImagenesID.concat(arrayID);
// //           let arrayArchivos = mascota.MascotasProceso.filter(
// //             (PasoArchivo) => PasoArchivo.Archivo != null
// //           );
// //           arrayArchivos = arrayArchivos.map((x) =>
// //             x.Archivo.replaceAll("\\", "/")
// //           );
// //           arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
// //           req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
// //           req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
// //         });
// //       }
// //     });
// //     if (usuarioFind.Protocolos.length != 0) {
// //       let ProtocolosUsuario = usuarioFind.Protocolos;
// //       ProtocolosUsuario.forEach((protocolo) => {
// //         let arrayArchivos = protocolo.Pasos.map((x) =>
// //           x.Archivo.replaceAll("\\", "/")
// //         );
// //         arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
// //         req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
// //       });
// //     }
// //     if (
// //       usuarioFind.Foto_Perfil != "/images/ImagenesPerfilUsuario/default.png"
// //     ) {
// //       req.deleteFilesPath.push(usuarioFind.Foto_Perfil);
// //     }

// //     usuarioFind
// //       .$query()
// //       .delete()
// //       .then(() => {
// //         let arrayPromises = [];
// //         arrayImagenesID.forEach((idImagen) => {
// //           arrayPromises.push(createPromiseEliminarImagen(idImagen));
// //         });
// //         let borrarArchivosPromises = deleteFiles(req);
// //         Promise.all(arrayPromises).then(() => {
// //           Promise.all(borrarArchivosPromises).then(() => {
// //             console.log("Todo correcto");
// //           });
// //         });
// //       });
// //     // usuarioFind
// //     //   .$query()
// //     //   .delete()
// //     //   .then(() => {

// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 287 ~ .then ~ arrayImagenesID",
// //       arrayImagenesID
// //     );
// //     //   });
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 270 ~ .then ~ req.deleteFilesPath",
// //       req.deleteFilesPath
// //     );
// //   })
// //   .catch((err) => {
// //     console.log(
// //       "🚀 ~ file: ModeradorController.js ~ line 309 ~ .then ~ err",
// //       err
// //     );
// //     // next(err);
// //   });

// // function createPromiseEliminarImagen(id) {
// //   // console.log(
// //   //   "🚀 ~ file: ModeradorController.js ~ line 222 ~ createPromiseReporte ~ reporte",
// //   //   reporte
// //   // );
// //   return new Promise((resolve, reject) => {
// //     resolve(
// //       Imagenes.query()
// //         .findById(id)
// //         .delete()
// //         .then(() => {})
// //     );
// //   });
// // }

// Date.prototype.addDays = function (days) {
//   var date = new Date(this.valueOf());
//   date.setDate(date.getDate() + days);
//   return date;
// };

// Date.prototype.substractMonths = function (months) {
//   var date = new Date(this.valueOf());
//   date.setMonth(date.getMonth() - months);
//   return date;
// };

// // let dateHoy = new Date(2003, 9, 1);
// // console.log(
// //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 391 ~ dateHoy",
// //   dateHoy
// // );
// // let pasos = [];

// // let paso1 = {
// //   t: "Paso 1",
// //   dias: 1,
// // };

// // pasos.push(paso1);

// // let paso2 = {
// //   t: "Paso 2",
// //   dias: 5,
// // };

// // pasos.push(paso2);

// // let paso3 = {
// //   t: "Paso 3",
// //   dias: 2,
// // };
// // pasos.push(paso3);

// // let paso4 = {
// //   t: "Paso 4",
// //   dias: 3,
// // };
// // pasos.push(paso4);
// // console.log("🚀 ~ file: pruebaContarDonaciones.js ~ line 422 ~ pasos", pasos);
// // let fechaAcumulador = dateHoy;

// // console.log(
// //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 431 ~ dateHoy.toString()",
// //   dateHoy.toLocaleDateString()
// // );
// // pasos.forEach((paso) => {
// //   fechaAcumulador = fechaAcumulador.addDays(paso.dias);
// //   // console.log(
// //   //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 432 ~ pasos.forEach ~ dateHoy",
// //   //   dateHoy
// //   // );
// //   console.log(
// //     "El",
// //     paso.t,
// //     "termina el: ",
// //     fechaAcumulador.toLocaleDateString("es-MX")
// //   );
// // });
// // console.log(
// //   "🚀 ~ file: pruebaContarDonaciones.js ~ line 431 ~ dateHoy.toString()",
// //   dateHoy.toLocaleDateString()
// // );

// // let Fecha_Generacion = getTodayDateFormated();
// // Mascota.query()
// //   .withGraphJoined("MascotasProceso.[Paso]")
// //   .findById(81)
// //   // .patchAndFetch({ Fecha_Ultima_Solicitud: Fecha_Generacion })
// //   .then((Mascota) => {
// //     let fecha = new Date(Fecha_Generacion);
// //     Mascota.MascotasProceso.forEach((paso) => {
// //       fecha = fecha.addDays(paso.Paso.DiasEstimados);
// //       console.log(
// //         "🚀 ~ file: pruebaContarDonaciones.js ~ line 462 ~ Mascota.MascotasProceso.forEach ~ fecha",
// //         getDateFormated(fecha)
// //       );
// //     });
// //   });

// // Pasos_Mascota.query()
// //   .withGraphJoined("Mascota.[MascotasSolicitudes]")
// //   .findOne({
// //     "paso_mascota.ID": 144,
// //     "Mascota:MascotasSolicitudes.Estado": 1,
// //   })
// //   .then((PasoFind) => {
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 478 ~ .then ~ PasoFind",
// //       PasoFind.Mascota
// //     );
// //     PasoFind.Mascota.MascotasSolicitudes[0]
// //       .$query()
// //       .patch({ Estado: 2 })
// //       .then(() => {
// //         console.log("XD");
// //       });
// //   });

// // Usuario.query()
// //   .withGraphFetched("Solicitudes.Mascota.[MascotasImagenes,MascotasEspecie]")
// //   .findById(4)
// //   .then((UsuarioSolicitudes) => {
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 497 ~ .then ~ UsuarioSolicitudes",
// //       UsuarioSolicitudes.Solicitudes[0].Mascota
// //     );
// //     // res.render("usuarioVerSolicitudes.ejs", {
// //     //   Tipo: req.session.Tipo,
// //     //   UsuarioSolicitudes: UsuarioSolicitudes,
// //     // });
// //   });

// // Usuario.query()
// //   .withGraphJoined("Solicitudes")
// //   .where("usuario.ID", "=", 4)
// //   .andWhere("Solicitudes.Estado", "=", 0)
// //   .orWhere("Solicitudes.Estado", "=", 1)
// //   .then((UsuarioSolicitudes) => {
// //     console.log(UsuarioSolicitudes);
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// // Protocolo.query()
// //   .withGraphJoined("[FormularioProtocolo,Pasos.[Mascota]]")
// //   .where("protocolos.ID_Usuario", "=", 4)
// //   .then((Protocolos) => {
// //     // res.render("Formulario/FormDashboard.ejs", {
// //     //   Elemento: Formularios,
// //     //   Elemento2: Protocolos,
// //     //   Tipo: req.session.Tipo,
// //     // });
// //     let Formularios = [];
// //     Protocolos.forEach((protocolo) => {
// //       console.log(protocolo.Titulo);
// //       if (protocolo.Pasos[0].Mascota.length > 0) {
// //         console.log("Este protocolo no se puede editar");
// //         protocolo.isEditable = false;
// //         protocolo.FormularioProtocolo.isEditable = false;
// //       } else {
// //         console.log("Este protocolo se puede editar");
// //         protocolo.isEditable = true;
// //         protocolo.FormularioProtocolo.isEditable = true;
// //       }
// //       Formularios.push(protocolo.FormularioProtocolo);
// //       console.log(protocolo);
// //       console.log("\n\n");
// //     });
// //   });

// //NOTIFICACIONES
// // let hoy = new Date(Date.now());
// // let fecha = getDateFormated(hoy);
// // let date2 = new Date(fecha);
// // date2 = date2.substractMonths(2);

// // console.log(date2);
// // Notificaciones.query()
// //   .where("Fecha_Generacion", "<", date2)
// //   .then((notificacionesBorrar) => {
// //     console.log(
// //       `Notificaciones a borrar a partir de la fecha: ${date2.toLocaleDateString(
// //         "es-MX"
// //       )} ${date2.toLocaleTimeString("es-MX")}`
// //     );
// //     console.log(`Fecha de ejecución ${fecha}`);
// //     console.log(notificacionesBorrar);
// //     let promises = [];
// //     notificacionesBorrar.forEach((notificacion) => {
// //       promises.push(promisesBorrarNotificacion(notificacion));
// //     });
// //     Promise.all(promises).then(() => {
// //       console.log(`${notificacionesBorrar.length} notificaciones borradas`);
// //     });
// //   });

// // function promisesBorrarNotificacion(notificacion) {
// //   return new Promise((resolve, reject) => {
// //     resolve(notificacion.$query().delete());
// //   });
// // }

// //USUARIOS INACTIVOS

// // let hoy = new Date(Date.now());
// // let fecha = getDateFormated(hoy);
// // let date2 = new Date(fecha);
// // date2 = date2.substractMonths(12);
// // console.log(
// //   date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
// // );

// // Usuario.query()
// //   .withGraphJoined(
// //     "[Publicaciones.[Mascota.[MascotasImagenes,MascotasProceso]],Protocolos.[Pasos]]",
// //     { minimize: true }
// //   )
// //   .where("usuario.UltimaConexion", "<", date2)
// //   .then((usuariosEliminar) => {
// //     // console.log(usuariosEliminar);
// //     console.log(
// //       `Usuarios a borrar a partir de la fecha: ${date2.toLocaleDateString(
// //         "es-MX"
// //       )} ${date2.toLocaleTimeString("es-MX")}`
// //     );
// //     console.log(`Fecha de ejecución ${fecha}`);
// //     console.log(usuariosEliminar);
// //     let usuariosPromises = [];
// //     usuariosEliminar.forEach((usuario) => {
// //       usuariosPromises.push(deleteUsuarioPromise(usuario));
// //     });
// //     Promise.all(usuariosPromises).then(() => {
// //       console.log(`Se han eliminado ${usuariosEliminar.length} usuarios`);
// //     });
// //   });

// //USUARIOS SIN VALIDACION
// // let hoy = new Date(Date.now());
// // let fecha = getDateFormated(hoy);
// // let date2 = new Date(fecha);
// // date2 = date2.substractMonths(5);
// // console.log(
// //   date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
// // );

// // Registro.query()
// //   .withGraphJoined("RegistroUsuario")
// //   .where("Fecha_Registro", "<", date2)
// //   .then((registrosEliminar) => {
// //     // console.log(usuariosEliminar);

// //     console.log(
// //       `Usuarios sin validar a borrar a partir de la fecha: ${date2.toLocaleDateString(
// //         "es-MX"
// //       )} ${date2.toLocaleTimeString("es-MX")}`
// //     );
// //     let usuariosEliminarArray = [];
// //     registrosEliminar.forEach((usuario) => {
// //       if (usuario.RegistroUsuario == null) {
// //         usuariosEliminarArray.push(usuario);
// //       }
// //     });
// //     console.log(`Fecha de ejecución ${fecha}`);

// //     console.log(usuariosEliminarArray);
// //     let registrosPromises = [];
// //     registrosEliminar.forEach((registro) => {
// //       registrosPromises.push(deleteRegistroPromise(registro));
// //     });
// //     Promise.all(usuariosPromises).then(() => {
// //       console.log(`Se han eliminado ${registrosEliminar.length} usuarios`);
// //     });
// //   });

// // function deleteRegistroPromise(registro) {
// //   return new Promise((resolve, reject) => {
// //     let documentos = registro.Documento_Identidad.split(";");
// //     let req = {
// //       deleteFilesPath: [],
// //     };
// //     documentos.forEach((documento) => {
// //       let pathCorrected = "public/" + documento;
// //       if (pathCorrected != "public/") {
// //         req.deleteFilesPath.push(pathCorrected);
// //       }
// //     });
// //     registro
// //       .$query()
// //       .delete()
// //       .then(() => {
// //         Promise.all(deleteFiles(req)).then(() => {
// //           resolve("ok");
// //         });
// //       });
// //   });
// // }

// //Mascotas inactivas
// // let hoy = new Date(Date.now());
// // let fecha = getDateFormated(hoy);
// // let date2 = new Date(fecha);
// // date2 = date2.substractMonths(4);
// // console.log(
// //   date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
// // );

// // Mascota.query()
// //   .where("Fecha_Ultima_Solicitud", "<", date2)
// //   .withGraphJoined("Mascota.[MascotasImagenes,MascotasProceso]")
// //   .then((MascotasEliminar) => {
// //     console.log(
// //       `Mascotas inactivas a borrar a partir de la fecha: ${date2.toLocaleDateString(
// //         "es-MX"
// //       )} ${date2.toLocaleTimeString("es-MX")}`
// //     );
// //     let promisesMascotas = [];
// //     MascotasEliminar.forEach((mascota) => {
// //       promiseMascotas.push(deleteMascotaPromise(mascota));
// //     });
// //     console.log(`Fecha de ejecución ${fecha}`);
// //     Promise.all(promisesMascotas).then(() => {
// //       console.log(`Se han eliminado ${MascotasEliminar.length} mascotas`);
// //     });
// //   });

// // function deleteMascotaPromise(mascota) {
// //   return new Promise((resolve, reject) => {
// //     let req = {};
// //     req.deleteFilesPath = [];
// //     let arrayImagenesID = [];
// //     let mascotasPublicacion = PublicacionUsuario.Mascota;
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
// //       mascota.MascotasImagenes
// //     );
// //     let arrayImagenes = mascota.MascotasImagenes.map(
// //       (x) => "public" + x.Ruta.replaceAll("\\", "/")
// //     );
// //     let arrayID = mascota.MascotasImagenes.map((x) => x.ID);
// //     arrayImagenesID = arrayImagenesID.concat(arrayID);
// //     let arrayArchivos = mascota.MascotasProceso.filter(
// //       (PasoArchivo) => PasoArchivo.Archivo != null
// //     );
// //     arrayArchivos = arrayArchivos.map((x) => x.Archivo.replaceAll("\\", "/"));
// //     arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
// //     req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
// //     req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
// //     mascota
// //       .query()
// //       .delete()
// //       .then(() => {
// //         Promise.all(deleteFiles(req)).then(() => {
// //           resolve("ok");
// //         });
// //       });
// //   });
// // }
// //Pasos proceso fuera de tiempo

// // function deleteUsuarioPromise(usuarioFind) {
// //   return new Promise((resolve, reject) => {
// //     let registroID = usuarioFind.FK_Registro;
// //     console.log(
// //       "🚀 ~ file: pruebaContarDonaciones.js ~ line 229 ~ .then ~ PublicacionesReportadas.Publicaciones[1]",
// //       usuarioFind
// //     );
// //     let req = {};
// //     req.deleteFilesPath = [];
// //     let arrayImagenesID = [];

// //     usuarioFind.Publicaciones.forEach((PublicacionUsuario) => {
// //       if (PublicacionUsuario.Mascota.length != 0) {
// //         let mascotasPublicacion = PublicacionUsuario.Mascota;
// //         mascotasPublicacion.forEach((mascota) => {
// //           console.log(
// //             "🚀 ~ file: pruebaContarDonaciones.js ~ line 115 ~ PublicacionesReportadas.Mascota.forEach ~  mascota.MascotasImagenes",
// //             mascota.MascotasImagenes
// //           );
// //           let arrayImagenes = mascota.MascotasImagenes.map(
// //             (x) => "public" + x.Ruta.replaceAll("\\", "/")
// //           );
// //           let arrayID = mascota.MascotasImagenes.map((x) => x.ID);
// //           arrayImagenesID = arrayImagenesID.concat(arrayID);
// //           let arrayArchivos = mascota.MascotasProceso.filter(
// //             (PasoArchivo) => PasoArchivo.Archivo != null
// //           );
// //           arrayArchivos = arrayArchivos.map((x) =>
// //             x.Archivo.replaceAll("\\", "/")
// //           );
// //           arrayImagenes = arrayImagenes.filter((Ruta) => Ruta != null);
// //           req.deleteFilesPath = req.deleteFilesPath.concat(arrayImagenes);
// //           req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
// //         });
// //       }
// //     });
// //     if (usuarioFind.Protocolos.length != 0) {
// //       let ProtocolosUsuario = usuarioFind.Protocolos;
// //       ProtocolosUsuario.forEach((protocolo) => {
// //         let arrayArchivos = protocolo.Pasos.map((x) =>
// //           x.Archivo.replaceAll("\\", "/")
// //         );
// //         arrayArchivos = arrayArchivos.filter((Archivo) => Archivo != null);
// //         req.deleteFilesPath = req.deleteFilesPath.concat(arrayArchivos);
// //       });
// //     }
// //     if (
// //       usuarioFind.Foto_Perfil != "/images/ImagenesPerfilUsuario/default.png"
// //     ) {
// //       req.deleteFilesPath.push(usuarioFind.Foto_Perfil);
// //     }

// //     usuarioFind
// //       .$query()
// //       .delete()
// //       .then(() => {
// //         let arrayPromises = [];
// //         arrayImagenesID.forEach((idImagen) => {
// //           arrayPromises.push(createPromiseEliminarImagen(idImagen));
// //         });
// //         let borrarArchivosPromises = deleteFiles(req);
// //         Promise.all(arrayPromises).then(() => {
// //           Promise.all(borrarArchivosPromises).then(() => {
// //             Registro.query()
// //               .deleteById(registroID)
// //               .then(() => {
// //                 console.log("Todo correcto");
// //                 // res.json("ok");
// //                 resolve("ok");
// //               });
// //           });
// //         });
// //       });
// //   });
// // }

// // function createPromiseEliminarImagen(id) {
// //   // console.log(
// //   //   "🚀 ~ file: ModeradorController.js ~ line 222 ~ createPromiseReporte ~ reporte",
// //   //   reporte
// //   // );
// //   return new Promise((resolve, reject) => {
// //     resolve(
// //       Imagenes.query()
// //         .findById(id)
// //         .delete()
// //         .then(() => {})
// //     );
// //   });
// // }

// // let hoy = new Date(Date.now());
// // let fecha = getDateFormated(hoy);
// // let date2 = new Date(fecha);
// // // date2 = date2.substractMonths(5);
// // console.log(
// //   date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
// // );

// // Pasos_Mascota.query()
// //   .where("Fecha_Limite", "<", date2)
// //   .andWhere("Completado", "<", 3)
// //   .andWhere("Mascota:MascotasSolicitudes.Estado", "=", 1)
// //   .withGraphJoined("[Mascota.[MascotasSolicitudes]]")
// //   .then((PasosIncompletos) => {
// //     let promisesPasosIncompletos = [];
// //     let promisesEliminarsolicitudes = [];
// //     PasosIncompletos.forEach((PasoIncompleto) => {
// //       promisesPasosIncompletos.push(createPromisesPasoDefault(PasoIncompleto));
// //       promisesEliminarsolicitudes.push(
// //         deleteSolicitudPromise(PasoIncompleto.Mascota)
// //       );
// //     });
// //     console.log(PasosIncompletos[0].Mascota);
// //   });

// // function deleteSolicitudPromise(mascota) {
// //   return new Promise((resolve, reject) => {
// //     resolve(
// //       mascota.MascotasSolicitudes[0]
// //         .$query()
// //         .delete()
// //         .then(() => {
// //           resolve("ok");
// //         })
// //     );
// //   });
// // }

// // function createPromisesPasoDefault(paso) {
// //   return new Promise((resolve, reject) => {
// //     Pasos_Mascota.query()
// //       .where("ID_Mascota", "=", paso.ID_Mascota)
// //       .then((pasos) => {
// //         // let arrayArchivos = [];
// //         let arrayPromises = [];
// //         let req = {};
// //         req.deleteFilesPath = [];
// //         pasos.forEach((pasoEncontrado) => {
// //           if (pasoEncontrado.Archivo != null) {
// //             req.deleteFilesPath.push(
// //               pasoEncontrado.Archivo.replaceAll("\\", "/")
// //             );
// //           }
// //           arrayPromises.push(patchPasosDefaultPromise(pasoEncontrado));
// //         });

// //         Promise.all(deleteFiles(req)).then(() => {
// //           Promise.all(arrayPromises).then(() => {
// //             resolve("ok");
// //           });
// //         });
// //       });
// //   });
// // }

// // function patchPasosDefaultPromise(PasoProceso) {
// //   let valueCompletado = 0;
// //   if (PasoProceso.ID_Paso == 1) {
// //     valueCompletado = 3;
// //   }
// //   return new Promise((resolve, reject) => {
// //     resolve(
// //       PasoProceso.$query()
// //         .patch({
// //           Completado: valueCompletado,
// //           Archivo: null,
// //           Fecha_Limite: null,
// //         })
// //         .then(() => {})
// //     );
// //   });
// // }

// // let string1 = "Juan Peréz".replaceAll(" ", "");
// // let string2 = "Juancho".replaceAll(" ", "");
// // let string3 = "Juan/!a".replaceAll(" ", "");
// // let string4 = "Ju4n 4lenj4ndro3".replaceAll(" ", "");

// // // check().isAlpha("es-ES")
// // let regex = /[^a-zñÑáÁéÉíÍóÓúÚüÜ]/i;
// // console.log(string1, " : ", !regex.test(string1));
// // console.log(string2, " : ", !regex.test(string2));
// // console.log(string3, " : ", !regex.test(string3));
// // console.log(string4, " : ", !regex.test(string4));
// // function getNotificacionesMeses(fecha_exec) {
// //   // Notificaciones.query().where()
// // }

// // Formulario.query()
// //   .where("formulario.ID_Usuario", "=", 4)
// //   .then((Formularios) => {
// //     Protocolo.query()
// //       .withGraphJoined("Pasos.[Mascota]")
// //       // .select(
// //       //   "protocolos.*",
// //       //   Protocolo.relatedQuery("Pasos.Mascota").count().as("numeroMascotas")
// //       // )
// //       .where("protocolos.ID_Usuario", "=", 4)
// //       .then((Protocolos) => {
// //         // res.render("Formulario/FormDashboard.ejs", {
// //         //   Elemento: Formularios,
// //         //   Elemento2: Protocolos,
// //         //   Tipo: req.session.Tipo,
// //         // });
// //         console.log(
// //           "🚀 ~ file: pruebaContarDonaciones.js ~ line 396 ~ .then ~ Protocolos",
// //           Protocolos[0].Pasos[0]
// //         );
// //         console.log(
// //           "🚀 ~ file: pruebaContarDonaciones.js ~ line 398 ~ .then ~ Formularios",
// //           Formularios
// //         );
// //       });
// //   });

// Date.prototype.substractDays = function (days) {
//   var date = new Date(this.valueOf());
//   date.setDate(date.getDate() - days);
//   return date;
// };

// // let fecha_exec = new Date(Date.now());
// // let fecha = getDateFormated(fecha_exec);
// // let date2 = new Date(fecha);
// // let date3;
// // date2 = date2.substractMonths(12);
// // date3 = date2.substractDays(7);
// // console.log(
// //   date2.toLocaleDateString("es-MX", date2.toLocaleTimeString("es-MX"))
// // );

// // Usuario.query()
// //   .withGraphJoined("UsuarioRegistro", { minimize: true })
// //   .where("usuario.UltimaConexion", ">", date3)
// //   .then((usuariosEliminar) => {
// //     // console.log(usuariosEliminar);
// //     console.log(
// //       `Fecha de aviso (Mandado de correos): ${date3.toLocaleDateString(
// //         "es-MX"
// //       )}`
// //     );
// //     console.log(
// //       `Usuarios a proximos a borrar a partir de la fecha: ${date2.toLocaleDateString(
// //         "es-MX"
// //       )} ${date2.toLocaleTimeString("es-MX")}`
// //     );
// //     console.log(`Fecha de ejecución ${fecha}`);
// //     console.log(`Fecha de ejecución ${fecha}`);
// //     console.log(usuariosEliminar);
// //     let usuariosPromises = [];
// //     usuariosEliminar.forEach((usuario) => {
// //       sendEmailAviso(
// //         "Aviso de inactividad",
// //         usuario.UsuarioRegistro.Correo,
// //         usuario.UsuarioRegistro.Nombre
// //       );
// //     });
// //     // usuariosEliminar.forEach((usuario) => {
// //     //   usuariosPromises.push(deleteUsuarioPromise(usuario));
// //     // });
// //     // Promise.all(usuariosPromises).then(() => {
// //     //   console.log(`Se han eliminado ${usuariosEliminar.length} usuarios`);
// //     // });
// //   });

// // let a = "images/ImagenesMascotas/imagen.png";
// // let b = a.split("/");
// // let c = b.pop();
// // console.log(a.replace(c, ""));
// // console.log(b);
// // console.log(c);

// Publicacion.query()
//   // .where("publicacion.ID", "=", req.params.idP)
//   .select(
//     "publicacion.*",
//     Publicacion.relatedQuery("PublicacionReporte").count().as("numeroReportes")
//   )
//   .having("numeroReportes", ">", 0)
//   .orHaving("Activo", "=", 0)
//   .orderBy("numeroReportes", "DESC")
//   .debug()
//   // .whereNot("numeroReportes", "=", 0)
//   .then((PublicacionesReportadas) => {
//     // console.log(PublicacionesReportadas);
//     // res.render("Moderador/verPublicacionesReportadas.ejs", {
//     //   Tipo: req.session.Tipo,
//     //   PublicacionesReportadas: PublicacionesReportadas,
//     // });
//     console.log(PublicacionesReportadas);
//     // resolve(countLikes);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Solicitudes.query()
//   .withGraphJoined("Mascota.MascotasProceso")
//   .findById(127)
//   .orderBy("Mascota:MascotasProceso.ID_Paso")
//   .then((xd) => {
//     console.log(xd.Mascota.MascotasProceso);
//   });

Mascota.query()
  .withGraphJoined("MascotasPasos.[PasoProceso]")
  .where("mascota.ID", "=", 156)
  .andWhere("MascotasPasos:PasoProceso.ID_Mascota", "=", 156)
  .orderBy("MascotasPasos:PasoProceso.ID_Paso")
  .then((xd) => {
    console.log(xd[0].MascotasPasos);
  });
