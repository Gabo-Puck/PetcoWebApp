var Usuario = require("../models/Usuario");
var Formulario = require("../models/Formulario");
var Preguntas = require("../models/Preguntas");
var Opciones = require("../models/Opciones_Respuestas_Preguntas");
var Solicitud = require("../models/Solicitudes");
var Preguntas_Formulario = require("../models/Preguntas_Formulario");
const Protocolo = require("../models/Protocolo");
const { check, validationResult } = require("express-validator");
const _ = require("lodash");
const Busboy = require("busboy");
var path = require("path");
var fs = require("fs");
var os = require("os");
const Paso = require("../models/Paso");

/**
 * Esta función middleware obtiene el template de paso.
 * @param {*} req Es el objeto que representa la request al servidor
 * @param {*} res Es el objeto que representa la response al cliente
 * @param {*} next Es el objetoque representa la siguiente función middleware en la cadena de ejecución
 */
function loadTemplate(req, res, next) {
  //Obtiene los elementos html del template renderizandolo
  res.render("Protocolo/PasoTemplate.ejs", {}, (error, html) => {
    //Se formatea el template y elimina los espacios y salto de linea
    req.htmlTemplate = html.replace(/(\r\n|\n|\r)/gm, "");
    next();
  });
}

exports.reviso = (req, res) => {
  Protocolo.query()
    .insertGraphAndFetch(Protocoloss)
    .then((protocolo) => console.log(protocolo));
};

/**
 * Esta función middleware obtiene los formularios del usuario logeado y el formulario estándar
 * @param {*} req Es el objeto que representa la request al servidor
 * @param {*} res Es el objeto que representa la response al cliente
 * @param {*} next Es el objetoque representa la siguiente función middleware en la cadena de ejecución
 * @returns
 */
function getFormularios(req, res, next) {
  return new Promise((resolve, reject) => {
    resolve(
      Formulario.query()
        .where("ID_Usuario", "=", req.session.IdSession)
        .orWhere("ID_Usuario", "=", 1)
        .then((formularios) => (res.formularios = formularios))
    );
  }).then(() => next());
}

/**
 * Esta función obtiene los pasos del protocolo estándar
 * @param {*} req Es el objeto que representa la request al servidor
 * @param {*} res Es el objeto que representa la response al cliente
 * @param {*} next Es el objetoque representa la siguiente función middleware en la cadena de ejecución
 * @returns
 */
function getProtocolo(req, res, next) {
  return new Promise((resolve, reject) => {
    resolve(
      Paso.query()
        .withGraphJoined("Proto.[FormularioProtocolo]")
        .where("Proto:FormularioProtocolo.ID_Usuario", "=", "1")
        .limit(2)
        .then((pasos) => {
          pasos.forEach((paso) => delete paso.Proto);
          res.pasos = pasos;
          console.log(res.pasos);
        })
    );
  }).then(() => next());
}

//Esta conjunto de middleware se encarga de cargar la vista de creación de protocolos
exports.list = [
  loadTemplate, // Ejecuta la funcion,
  getFormularios,
  getProtocolo,
  (req, res) => {
    console.log(req.htmlTemplate);
    // console.log(res.pasos);
    res.render("Protocolo/CrearProtocolo", {
      formularios: res.formularios,
      Response: req.htmlTemplate,
      pasos: res.pasos,
    });
  },
];

var acceptedTypes = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
];

/**
 * Función middleware que se puede añadir al flujo de una request. Permite hacer lo siguiente:
 * - Añadir al req.body los valores de la request del usuario.
 * - Añadir al res.fileReadableStream los stream para escribir archivos al disco del servidor.
 *
 * Los archivos se evaluaran con respecto a los mimeType que se provean en acceptedTypes y también se revisará su tamaño en bytes
 * - Si alguno de los archivos cuenta con un mimeType que no se encuentre en acceptedTypes, se agregará un error correspondiente al res.errors.
 * - Si alguno de los archivos rebasa el limite de 10mb, se agregará un error correspondiente al res.errors.
 *
 * Este middleware se puede usar con request que tengan Content-Type: multipart/form-data.
 * @param {*} acceptedTypes Los mimeType validos que se aceptarán
 * @param {*} folderPath La dirección relativa de la carpeta donde se guardarán los archivos
 * @returns
 */
const fetchInput = (acceptedTypes, folderPath) => {
  return (req, res, next) => {
    {
      let extensions = {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/png": "png",
      };
      //Inicializamos una instancia de Busboy, obtenemos los headers de la request para saber que efectivamente es una request de Content-Type: multipart/form-FormData
      //Además lo inicializamos con un limite de 10mb para evitar escribir archivos de mayor tamaño
      var busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: 10000000 },
      });
      //Inicializamos el fileReadableStream
      res.fileReadableStream = [];
      //Inicializamos errors
      res.errors = [];

      //Usamos el listener de la instancia de busboy. Este listener se activará 1 vez por cada archivo encontrado en la request
      busboy.on(
        "file",
        function (fieldname, file, fileData, encoding, mimetype) {
          console.log(fileData);
          // console.log(fieldname);
          //Usamos el listener del archivo encontrado. Este listener se activará su el archivo supera el limite que se establece en limits
          file.on("limit", function (data) {
            console.log("Limit reached");
            res.errors.push({
              msg: "El limite de tamaño para archivos es de 10mb",
              formID: fieldname,
            });
          });
          var type;
          //Revisamos si el mimeType del archivo encontrado se encuentra dentro de los que se desean aceptar
          //Si no lo es, agregamos al array de errores un mensaje correspondiente

          //Ciclo para obtener todos las extensiones de acuerdo a los mimeType que se hayan pasado como parametro, y cada extensión se concatena a "extensionAceptados"
          if (acceptedTypes.indexOf(fileData.mimeType) === -1) {
            var extensionAceptados = "";
            for (const key in extensions) {
              if (Object.hasOwnProperty.call(extensions, key)) {
                const element = extensions[key];
                if (acceptedTypes.indexOf(key) != -1) {
                  extensionAceptados = extensionAceptados.concat(element, ", ");
                }
              }
            }
            //Eliminamos espacio y coma del final del string
            extensionAceptados = extensionAceptados.trimEnd();
            extensionAceptados = extensionAceptados.slice(
              0,
              extensionAceptados.length - 1
            );
            //Añadimos el error al array de errores
            res.errors.push({
              msg: `El tipo de archivo aceptado es: ${extensionAceptados}`,
              formID: fieldname,
            });
          } else {
            //Si el mimeType se encuentra dentro de los que se desean aceptar,
            //buscamos entre las extensiones de archivos y lo asignamos a type
            for (const key in extensions) {
              if (Object.hasOwnProperty.call(extensions, key)) {
                const element = extensions[key];
                if (key == fileData.mimeType) {
                  type = element;
                  break;
                }
              }
            }
            //Generamos el nombre del archivo
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            // const nombreArchivo = fileData.fileData.replace(/\s/g, "");
            //Le agregamos la extensión
            const pathFile = `${uniqueSuffix}.${type}`;
            //De acuerdo a la carpeta "folderPath", concatenamos la ruta de la carpeta y el nombre del archivo
            var saveTo = path.join(folderPath, pathFile);
            //Añadimos al array de fileRedeableStream, el stream del archivo y la dirección.
            res.fileReadableStream.push({ path: saveTo, stream: file });
            req.body[fieldname] = saveTo;
            // file.pipe(fs.createWriteStream(saveTo));
          }
          file.resume();
        }
      );
      //Usamos el listener de la instancia de busboy. Este listener se activará cuando se terminen de tratar todos los campos y archivos de la request
      busboy.on("finish", function () {
        console.log("Upload complete");
        next();
      });
      //Usamos el listener de la instancia de busboy. Este listener se activará 1 vez por cada campo encontrado en la request
      busboy.on("field", function (key, value, keyTruncated, valueTruncated) {
        console.log("The value key: " + key + " is: " + value);
        if (key == "Pasos") {
          req.body[key] = JSON.parse(value);
        } else {
          req.body[key] = value;
        }
      });
      req.pipe(busboy);
    }
  };
};

/**
 * Esta función permite escribir archivos al servidor. Los stream encargados de escribir archivos deben estar dentro de un array en la propiedad "res.fileReadableStream"
 * @param {*} res El objeto que representa la respuesta al cliente
 */
const uploadFiles = (res) => {
  //Revisamos si fileReadableStream no esta vacio.
  if (res.fileReadableStream.length > 0) {
    res.fileReadableStream.forEach((fileArray) => {
      fileArray.stream.pipe(fs.createWriteStream(fileArray.path));
    });
  }
};

/**
 * Esta función middleware se encarga de ejecutar la validation-chain de express-validator.
 * - Los resultados de la validation-chain se guardarán en res.errors
 * - Los errores que no son de un input, se guardan en res.globalError
 *
 * Si no se generan errores en la validación, se pasa al siguiente elemento en la cadena de ejecución
 *
 * Si hay errores en la validación se devuelven en formato json al cliente por medio de res.json
 *
 *
 *
 *
 * @returns
 */

const verificarInput = () => {
  return (req, res, next) => {
    // console.log(req.body);
    var result = validationResult(req).array({ onlyFirstError: true });
    // console.log(req.body.Pasos);

    /*Si un protocolo tiene menos de 4 pasos no debería de ser apto
     * Los dos primeros pasos son los del formulario estándar, por lo tanto solo debemos de revisar
     * que el protocolo tenga por lo menos otros 2 pasos
     */
    if (req.body.Pasos.length < 2) {
      res.globalError = {
        gloabalMsg: "Un protocolo valido debe de tener por lo menos 4 pasos",
      };
    }

    //Si el resultado de la validation-chain no esta vacía, agregamos los errores generados al res.errors
    if (result.length >= 1) {
      result.forEach((error) => {
        // console.log(error);
        var msg = error.msg;
        var formID = _.get(req.body, error.param + "ID");

        res.errors.push({
          msg: msg,
          formID: formID,
        });
      });

      // res.json(res.errors);
    }
    //Si no se genero ningun error, seguimos con la siguiente funcion en la cadena de ejecución
    //De otra manera, mandamos los errores al cliente.
    if (res.errors.length == 0 && !res.globalError) {
      next();
    } else {
      res.json({ errors: res.errors, globalError: res.globalError });
    }
  };
};

/**
 * Esta función middleware elimina las propiedades que no se necesitan para escribir el protocolo a la base de datos.
 * @param {*} req Es el objeto que representa la request al servidor
 * @param {*} res Es el objeto que representa la response al cliente
 * @param {*} next Es el objetoque representa la siguiente función middleware en la cadena de ejecución
 */

function cleanInput(req, res, next) {
  delete req.body["TituloID"];
  delete req.body["DescripcionID"];
  delete req.body["TituloID"];

  req.body["Pasos"].forEach((paso) => {
    paso["Archivo"] = req.body[paso.AceptaArchivoName];
    if (paso["Archivo"] == "undefined") {
      paso["Archivo"] = "";
    }
    delete req.body[paso.AceptaArchivoName];
    delete paso["Titulo_PasoID"];
    delete paso["DescripcionID"];
    delete paso["DiasEstimadosID"];
    delete paso["AceptaArchivoName"];
  });
  next();
}

/*Este conjunto de funciones middleware se encarga revisar el input del usuario a la hora de crear un protocolo, generar y mandar mensajes de error, 
  crear los registros correspondientes en la base de datos y escribir en el disco los archivos correspondientes*/
exports.ProtocoloCrear = [
  fetchInput(acceptedTypes, "./public/archivosPasos"),
  check("Pasos.*.Titulo_Paso")
    .isLength({ min: 10 })
    .withMessage("El titulo debe de tener por lo menos 5 caracteres"),
  check("Pasos.*.Descripcion")
    .isLength({ min: 10 })
    .withMessage("La descripción debe de tener por lo menos 10 caracteres"),
  check("Pasos.*.DiasEstimados")
    .isLength({ min: 1 })
    .withMessage("Los días estimados deben de tener por lo menos 1 numero")
    .isInt()
    .withMessage("Los días estimados deben ser números"),
  check("Titulo")
    .isLength({ min: 10 })
    .withMessage("El titulo debe de tener por lo menos 10 caracteres"),
  check("Descripcion")
    .isLength({ min: 10 })
    .withMessage("La descripción debe de tener por lo menos 10 caracteres"),
  // check("ID_Formulario"),
  verificarInput(),
  cleanInput,
  (req, res) => {
    console.log("im here now");
    console.log(req.body);
    // res.json("ok");
    Protocolo.query()
      .insertGraphAndFetch(req.body)
      .then((protocolo) => console.log(protocolo))
      .then(() => uploadFiles(res))
      .then(() => res.json("ok"));
    // console.log(req.body);
  },
];
