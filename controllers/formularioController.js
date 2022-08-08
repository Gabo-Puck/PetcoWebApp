var Usuario = require("../models/Usuario");
var Formulario = require("../models/Formulario");
var Preguntas = require("../models/Preguntas");
var Opciones = require("../models/Opciones_Respuestas_Preguntas");
var Solicitud = require("../models/Solicitudes");
var Preguntas_Formulario = require("../models/Preguntas_Formulario");
const Solicitudes = require("../models/Solicitudes");
const Opciones_Respuestas_Preguntas = require("../models/Opciones_Respuestas_Preguntas");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const Respuestas = require("../models/Respuestas");
const { response } = require("express");
const { JSDOM } = jsdom;

exports.formularioList = (req, res) => {
  Usuario.query()
    .withGraphJoined("Formularios")
    .then((Formulario) => res.json(Formulario));
};

exports.formularioPreguntas = (req, res) => {
  Formulario.query()
    .withGraphJoined("Preguntas.[Opciones_Respuestas_Pregunta,Respuestas]")
    .where("Formulario.ID", "=", "18")
    .then((FormWPreguntas) => res.json(FormWPreguntas));
};

exports.preguntasOpciones = (req, res) => {
  Opciones.query()
    .withGraphJoined("Pregunta")
    .then((OpcionesPregunta) => res.json(OpcionesPregunta));
};

exports.crearFormulario = (req, res) => {
  res.render("Formulario/CrearFormulario");
};

exports.verSolicitud = (req, res) => {
  // Solicitud.query()
  //   .withGraphJoined("RespuestasFormulario.[Pregunta]")
  //   .then((Solicitudes) => res.json(Solicitudes));

  // Formulario.query()
  //   .withGraphJoined("Preguntas.[Respuestas]")
  //   .where("Preguntas:Respuestas.ID_Solicitud", "=", 2)
  //   .then((resultado) => res.json(resultado));
  Usuario.query()
    .withGraphJoined("Solicitudes")
    .then((Sol) => res.json(Sol));
};

exports.verifyFormulario = (req, res) => {
  console.log(req.body);
  var errors = [];
  var correct = [];
  var globalError = [];
  var total =
    req.body.abiertas.length +
    req.body.cerradas.length +
    req.body.multiples.length;
  var min = 5;

  if (total < min) {
    globalError.push(
      `El formulario debe de tener por lo menos ${min} preguntas`
    );
  }

  if (req.body.titulo.tituloText.replace(/ /g, "").length < 6) {
    errors.push({
      formID: req.body.titulo.formID,
      msg: "El titulo debe tener por lo menos 6 caracteres",
    });
  } else {
    correct.push({ formID: req.body.titulo.formID, msg: "Bien!" });
  }

  req.body.abiertas.forEach((pregunta) => {
    console.log(pregunta.preguntaText.replace(/ /g, ""));
    if (pregunta.preguntaText.replace(/ /g, "").length <= 7) {
      errors.push({
        formID: pregunta.formID,
        msg: "La pregunta debe tener por lo menos 7 caracteres",
      });
    } else {
      correct.push({ formID: pregunta.formID, msg: "Bien!" });
    }
  });
  validateCerradaMultiple(req.body.cerradas, errors, correct);
  validateCerradaMultiple(req.body.multiples, errors, correct);
  res.json({ errors: errors, correct: correct, globalError: globalError });
};

/**
 * Funcion que permite validar un array de preguntas con posibles respuestas, y generar mensajes para inputs correctos e incorrectos
 * @param {*} preguntas Array de preguntas del mismo tipo a validar
 * @param {*} errors Array el cual contiene los mensajes de error para input incorrecto y el id del elemento html asociado a dicho input
 * @param {*} correct Array el cual contiene los mensajes de input correcto y el id del elemento html asociado a dicho input
 */

function validateCerradaMultiple(preguntas, errors, correct) {
  preguntas.forEach((pregunta) => {
    console.log(pregunta.preguntaText.replace(/ /g, ""));
    var error = "";
    if (pregunta.preguntaText.replace(/ /g, "") <= 7) {
      error = "La pregunta debe tener por lo menos 7 caraceteres";
    }
    if (pregunta.respuestas.length <= 1) {
      error += "\nLa pregunta debe de tener por lo menos dos respuestas";
    }
    pregunta.respuestas.forEach((respuesta) => {
      console.log(respuesta.respuestaText.length);
      if (respuesta.respuestaText.replace(/ /g, "").length < 1) {
        errors.push({
          formID: respuesta.formID,
          msg: "La respuesta debe tener por lo menos 1 caracter",
        });
      } else {
        correct.push({ formID: respuesta.formID, msg: "Bien!" });
      }
    });
    if (error == "") {
      correct.push({ formID: pregunta.formID, msg: "Bien!" });
    } else {
      errors.push({ formID: pregunta.formID, msg: error });
    }
  });
}

// Post de preguntas con promises
/**
 *Crea una promise que se resuelve con el resultado de insertar una respuesta de una pregunta a la tabla "Opciones_Respuestas_Preguntas"
  Insert no devuelve nada, sin embargo al retornar la promise podemos hacer uso de ella más adelante en un método como Promise.all para ejecutar un conjunto de promises
 * @param {*} respuesta Respuesta posible a una pregunta
 * @param {*} idPregunta ID de la pregunta a la que pertenece la respuesta
 * @returns Una promise que permite subir la respuesta a la base de datos
 */
function createRespuestaPromise(respuesta, idPregunta) {
  return new Promise(function (resolve, reject) {
    resolve(
      Opciones_Respuestas_Preguntas.query().insert({
        ID_Pregunta: idPregunta,
        Opcion_Respuesta: respuesta.respuestaText,
      })
    );
  });
}
/*createRespuestasPromiseArray */

/**
 * Crea un array que contiene promises de cada una de las respuestas de una pregunta. Al retornar el array podemos hacer uso de estas promises en
   otros métodos como Promise.all para ejecutar todas todas las promises
 * @param {*} respuestas Array de respuestas posibles a una pregunta
 * @param {*} idPregunta ID de la pregunta a la cual pertenecen todas las respuestas
 * @returns Un array que contiene las promises para crear cada una de las respuestas
 */

function createRespuestasPromiseArray(respuestas, idPregunta) {
  var respuestasPromises = [];
  respuestas.forEach((respuesta) =>
    respuestasPromises.push(createRespuestaPromise(respuesta, idPregunta))
  );
  return respuestasPromises;
}

/**
 *
 * @param {*} pregunta Pregunta la cual se desea agregar a la base de datos
 * @param {*} idFormulario ID del formulario al cual pertenece la pregunta
 * @returns Una promise para subir la pregunta a la base de datos
 */

function createPreguntaPromise(pregunta, idFormulario) {
  if (pregunta.tipo == 1) {
    return new Promise(function (resolve, reject) {
      resolve(
        Preguntas.query().insertAndFetch({
          Pregunta: pregunta.preguntaText,
          Tipo: pregunta.tipo,
          Opcional: pregunta.opcional,
        })
      );
    }).then((res) =>
      Preguntas_Formulario.query().insertAndFetch({
        ID_Pregunta: res.ID,
        ID_Formulario: idFormulario,
      })
    );
  }
  if (pregunta.tipo == 2 || pregunta.tipo == 3) {
    return new Promise(function (resolve, reject) {
      resolve(
        Preguntas.query().insertAndFetch({
          Pregunta: pregunta.preguntaText,
          Tipo: pregunta.tipo,
          Opcional: pregunta.opcional,
        })
      );
    })
      .then((res) =>
        Preguntas_Formulario.query().insertAndFetch({
          ID_Pregunta: res.ID,
          ID_Formulario: idFormulario,
        })
      )
      .then((res) =>
        createRespuestasPromiseArray(pregunta.respuestas, res.ID_Pregunta)
      )
      .then((res) => Promise.all(res));
  }
}

/**
 * Crea un array de promises para cada tipo de pregunta que se tenga en el req.body
 * @param {*} abiertas Array de preguntas abiertas en el request
 * @param {*} cerradas Array de preguntas cerradas en el request
 * @param {*} multiples Array de preguntas multiples en el request
 * @param {*} formularioID ID (int) del formulario al cual pertenecen las preguntas
 * @returns Un array que contiene todos los promises necesarios para subir una pregunta de cualquier tipo a la base de datos
 */
function createPreguntasBodyArray(abiertas, cerradas, multiples, formularioID) {
  var promisesPreguntasBody = [];
  promisesPreguntasBody.push(
    createPreguntasPromiseArray(abiertas, formularioID)
  );
  promisesPreguntasBody.push(
    createPreguntasPromiseArray(cerradas, formularioID)
  );
  promisesPreguntasBody.push(
    createPreguntasPromiseArray(multiples, formularioID)
  );
  return promisesPreguntasBody;
}

/**
 * Esta función nos permite crear un array de promises dada una pregunta que se haya mandado en el request
 * @param {*} preguntas Un array de preguntas al que se desea agregar a la base de datos
 * @param {*} idFormulario El id del formulario al que pertenecen las preguntas
 * @returns Un array de promises que permite subir las preguntas a la base de datos
 */

function createPreguntasPromiseArray(preguntas, idFormulario) {
  var preguntasPromises = [];
  preguntas.forEach((pregunta) =>
    preguntasPromises.push(createPreguntaPromise(pregunta, idFormulario))
  );
  return preguntasPromises;
}

exports.formulario_crear_post = (req, res) => {
  var IdSession = req.session.IdSession;

  var formularioCreado = Formulario.query()
    .insertAndFetch({
      Titulo: req.body.titulo.tituloText,
      ID_Usuario: IdSession,
    })
    .then((formulario) =>
      createPreguntasBodyArray(
        req.body.abiertas,
        req.body.cerradas,
        req.body.multiples,
        formulario.ID
      )
    )
    .then((promises) => Promise.all(promises))
    .then(() => res.json({ response: "ok" }));
};

exports.formDashboard = (req, res) => {
  res.json({ res: "AQUI SE SUPONE QUE VA EL DASHBOARD XD" });
};
function promiseFetchDoc(html) {
  return new Promise(function (resolve, reject) {
    var parserDOM = new JSDOM(html);
    // var a = parserDOM.serialize();

    // var doc = new DOMParser().parseFromString(html, "text/html");
    var response = {};
    response.doc = parserDOM.serialize().replace(/(\r\n|\n|\r)/gm, "");
    // console.log(response.doc.abiertaTemplate.cloneNode(true));
    resolve(response);
  });
}
function promiseFetchTemplate(Formulario) {
  return new Promise(function (resolve, reject) {
    resolve(fetch("http://localhost:3000/formulario/preguntaTemplate"));
    // .then((res) => res.text())
    // .then((html) => {});
  })
    .then((res) => res.text())
    .then(
      (html) => promiseFetchDoc(html)

      // var parserDOM = new DOMParser();
      // var doc = new DOMParser().parseFromString(html, "text/html");

      // preguntaAbierta = doc.querySelector(".preguntaAbierta").cloneNode(true);
      // preguntaCerrada = doc.querySelector(".preguntaCerrada").cloneNode(true);
      // preguntaMultiple = doc.querySelector(".preguntaMultiple").cloneNode(true);
      // respuestaCerrada = doc.querySelector(".respCerr").cloneNode(true);
      // respuestaMultiple = doc.querySelector(".respMult").cloneNode(true);
    )
    .then((response) => {
      response.Formulario = Formulario;
      return response;
    });
}
exports.formulario_edit_get = (req, res) => {
  console.log("a");
  Formulario.query()
    .withGraphJoined("Preguntas.[Opciones_Respuestas_Pregunta,Respuestas]")
    .where("Formulario.ID", "=", "46")
    // .then((FormWPreguntas) => FormWPreguntas.json())
    .then((Formulario) => promiseFetchTemplate(Formulario))
    .then((response) => {
      // console.log(FormWPreguntas);
      console.log(response);
      res.render("Formulario/EditarFormulario", {
        Response: response,
      });
    });
  // res.render("Formulario/EditarFormulario");
  // res.render("Formulario/PreguntasTemplate", {}, (err, html) => {
  //   res.send(html);
  // });
};

exports.formulario_edit_post = (req, res) => {
  console.log(req.body);

  deleteContenidos(req.body.contenidoEliminado.preguntas, Preguntas)
    .then(
      deleteContenidos(
        req.body.contenidoEliminado.respuestas,
        Opciones_Respuestas_Preguntas
      )
    )
    .then(updateContenidos(req.body.contenidoCambiado.preguntas, Preguntas))
    .then(
      updateContenidos(
        req.body.contenidoCambiado.respuestas,
        Opciones_Respuestas_Preguntas
      )
    )
    .then(
      addContenidosPreguntas(
        req.body.titulo.tituloText,
        req.body.ID,
        req.body.contenidoAgregado.preguntas
      )
    )
    .then(addContenidosRespuestas(req.body.contenidoAgregado.respuestas))
    .then(res.json({ response: "ok" }));

  // res.json({ response: "ok" });
};

exports.formTest2 = (req, res) => {
  res.render("Formulario/PreguntasTemplate", {}, (err, html) => {
    res.send(html);
  });
  Formulario.query().deleteById();
};

function deleteContenidos(contenidos, tabla) {
  return new Promise((resolve, reject) => {
    if (contenidos.length !== 0) {
      contenidos.forEach((contenido) => {
        resolve(tabla.query().deleteById(contenido.ID));
        console.log(contenido.ID);
      });
    }
  });
}
function updatePromises(contenido, tabla) {
  return new Promise((resolve, reject) => {
    resolve(tabla.query().findById(contenido.ID).patch(contenido));
  });
}

function updateContenidos(contenidos, tabla) {
  return new Promise((resolve, reject) => {
    if (contenidos.length !== 0) {
      var arrayUpdate = [];
      contenidos.forEach((contenido) => {
        if (contenido.Opcional) {
          if (contenido.Opcional == true) {
            contenido.Opcional = 1;
          }
          if (contenido.Opcional == false) {
            contenidos.Opcional = 0;
          }
        }
        arrayUpdate.push(updatePromises(contenido, tabla));
      });
      resolve(arrayUpdate);
    }
  }).then((response) => Promise.all(response));
}

function addContenidosPreguntas(titulo, formularioID, contenido) {
  return new Promise((resolve, reject) => {
    resolve(
      Formulario.query().patchAndFetchById(formularioID, { Titulo: titulo })
    );
  })
    .then((formulario) =>
      createPreguntasBodyArray(
        contenido.abiertas,
        contenido.cerradas,
        contenido.multiples,
        formulario.ID
      )
    )
    .then((promises) => Promise.all(promises));
}

function addRespuestasPromises(contenidos) {
  var promisesRespuestas = [];

  contenidos.forEach((contenido) => {
    promisesRespuestas.push(
      new Promise((resolve, reject) =>
        resolve(Opciones_Respuestas_Preguntas.query().insert(contenido))
      )
    );
  });
  return promisesRespuestas;
}

function addContenidosRespuestas(contenidos) {
  contenidos.forEach((element) => {});
  return new Promise((resolve, reject) => {
    resolve(addRespuestasPromises(contenidos));
  }).then((res) => Promise.all(res));
}
