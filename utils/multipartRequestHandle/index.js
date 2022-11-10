const { check, validationResult } = require("express-validator");
const _ = require("lodash");
const Busboy = require("busboy");
var path = require("path");
const { PassThrough, Readable } = require("stream");
var fs = require("fs");
var os = require("os");
const { resolve } = require("path");
const { ValidationError } = require("../ValidationError");
const {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
} = require("firebase/storage");
/**
 * Función middleware que se puede añadir al flujo de una request. Permite hacer lo siguiente:
 * - Añadir al req.body los valores de la request del usuario.
 * - Añadir al res.fileReadableStream los stream para escribir archivos al disco del servidor.
 *   fileReadableStream es un arreglo, donde cada objeto tiene la siguiente estructura:
 *   - path: Es la dirección donde el archivo debería de guardarse
 *   - stream: Es el readable stream para manipular el archivo
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
exports.fetchInput = (acceptedTypes, folderPath) => {
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

      // //Usamos el listener de la instancia de busboy. Este listener se activará 1 vez por cada archivo encontrado en la request
      //Usamos el listener de la instancia de busboy. Este listener se activará 1 vez por cada archivo encontrado en la request
      // busboy.on("file", (name, file, info) => {
      //   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      //   // const nombreArchivo = fileData.fileData.replace(/\s/g, "");
      //   //Le agregamos la extensión
      //   const pathFile = `${uniqueSuffix}.${info.filename.split(".", 2)[1]}`;
      //   const saveTo = path.join(folderPath, pathFile);
      //   file.pipe(fs.createWriteStream(saveTo));
      // });
      busboy.on("file", function (fieldname, file, fileData) {
        console.log(file);
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
          file.resume();
          console.log("a");
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
          var saveTo = folderPath + "/" + pathFile;
          //Añadimos al array de fileRedeableStream, el stream del archivo y la dirección.
          //creamos un stream de lectura donde se guardarán los buffer del archivo
          var readable = new Readable();
          const dataList = [];
          readable._read = (size) => {};
          file.on("data", (data) => {
            console.log(data);
            readable.push(data);
            dataList.push(data);
          });
          file.on("end", () => {
            readable.push(null);
            res.fileReadableStream.push({
              path: saveTo,
              stream: readable,
              byteArray: Buffer.concat(dataList),
            });
            req.body[fieldname] = saveTo;
          });
        }
        // file.pipe(fs.createWriteStream(saveTo));
      });
      //Usamos el listener de la instancia de busboy. Este listener se activará cuando se terminen de tratar todos los campos y archivos de la request
      busboy.on("finish", function () {
        console.log("Upload complete");
        next();
      });
      //Usamos el listener de la instancia de busboy. Este listener se activará 1 vez por cada campo encontrado en la request
      busboy.on("field", function (key, value, keyTruncated, valueTruncated) {
        console.log("The value key: " + key + " is: " + value);
        if (isJson(value)) {
          req.body[key] = JSON.parse(value);
        } else {
          req.body[key] = value;
        }
      });
      req.pipe(busboy);
    }
  };
};

function isJson(string) {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * Esta función permite escribir archivos al servidor. Los stream encargados de escribir archivos deben estar dentro de un array en la propiedad "res.fileReadableStream"
 * @param {*} res El objeto que representa la respuesta al cliente
 */
exports.uploadFiles = (res, storage) => {
  //Revisamos si fileReadableStream no esta vacio.
  let arrayProm = [];
  if (res.fileReadableStream.length > 0) {
    res.fileReadableStream.forEach((fileArray) => {
      // fileArray.stream.pipe(fs.createWriteStream(fileArray.path));
      arrayProm.push(
        createPromisesSubirArchivos(
          storage,
          fileArray.path,
          fileArray.byteArray
        )
      );
    });
  }
  return arrayProm;
};

function createPromisesSubirArchivos(storage, path, fileArray) {
  return new Promise((resolve, reject) => {
    let fullPath = path;
    let fragmentedPath = fullPath.split("/");
    let fileName = fragmentedPath.pop();
    let referencePath = fullPath.replace(fileName, "");
    console.log(
      "🚀 ~ file: index.js ~ line 187 ~ returnnewPromise ~ referencePath",
      referencePath
    );
    // console.log()
    let storageRef = ref(storage);
    fragmentedPath.forEach((route) => {
      storageRef = ref(storageRef, route);
    });
    storageRef = ref(storageRef, fileName);
    uploadBytes(storageRef, fileArray).then((snapshot) => {
      console.log("Archivo subido correctamente");
      resolve("ok");
    });
  });
}

function createDelete(storage, path) {
  return new Promise((resolve, reject) => {
    // resolve(fs.promises.rm(path, { force: true }));
    let fullPath = path;
    let fragmentedPath = fullPath.split("/");
    let fileName = fragmentedPath.pop();
    let referencePath = fullPath.replace(fileName, "");
    console.log(
      "🚀 ~ file: index.js ~ line 187 ~ returnnewPromise ~ referencePath",
      referencePath
    );
    // console.log()
    let storageRef = ref(storage);
    fragmentedPath.forEach((route) => {
      storageRef = ref(storageRef, route);
    });
    storageRef = ref(storageRef, fileName);
    deleteObject(storageRef)
      .then((snapshot) => {
        console.log("Archivo eliminado correctamente");
        resolve("ok");
      })
      .catch((err) => {
        console.log("notok: " + err);
        resolve("notok");
      });
  }).catch((err) => {
    console.log("path->" + path);
    console.log(err);
    resolve("notok: " + err);
  });
}

exports.deleteFiles = (req) => {
  let deleteFilesPromises = [];

  if (req.deleteFilesPath) {
    console.log(req.deleteFilesPath);
    if (req.deleteFilesPath.length > 0) {
      req.deleteFilesPath.forEach((filePath) => {
        deleteFilesPromises.push(
          createDelete(req.app.storageFirebase, filePath)
        );
      });
    }
  }
  return deleteFilesPromises;
};

exports.cleanInputID = (input) => {
  for (const key in input) {
    if (Object.hasOwnProperty.call(input, key)) {
      // const element = validatedInput[key];
      let isId = key.substring(key.length - 2).includes("ID");
      if (isId) {
        delete input[key];
      }
      if (Array.isArray(input[key])) {
        input[key].forEach((element) => {
          this.cleanInputID(element);
        });
      }
    }
  }
  console.log(input);
};

exports.validateBody = (req, res, next) => {
  var validationObject = validationResult(req).array({ onlyFirstError: true });
  if (validationObject.length > 0) {
    var errorObject = new ValidationError(validationObject);
    validationObject.forEach((error) => {
      var ID_Error = _.get(req.body, error.param + "ID");
      errorObject.errors.push({ ID: ID_Error, msg: error.msg });
    });
    return next(errorObject);
  }
  next();
};
