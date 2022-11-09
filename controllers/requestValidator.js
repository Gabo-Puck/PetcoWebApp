const multer = require("multer");
var path = require("path");
const { validationResult, Result } = require("express-validator");
const { uploadFiles } = require("../utils/multipartRequestHandle");

class requestError {
  constructor(message, formName) {
    this.msg = message;
    this.formName = formName;
  }
}

module.exports.validateRequest = (req, res, next) => {
  console.log("Estoy en validateRequest");
  console.log(req.body);
  console.log(Object.keys(req.body));
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    res.errorsInputText = result.array({ onlyFirstError: true });
    if (!res.errors) res.errors = [];
    if (!res.correctFields) res.correctFields = [];
    var fields = Object.keys(req.body);
    fields.forEach((field) => {
      var found = false;
      var messageErr;
      res.errorsInputText.forEach((element) => {
        if (element.param == field) {
          found = true;
          messageErr = element.msg;
        }
      });
      if (found) {
        res.errors.push(new requestError(messageErr, field));
      } else {
        res.correctFields.push(field);
      }
    });
  }

  return next();
};

module.exports.validateFilesExtension = (acceptedTypes) => {
  return (req, res, next) => {
    console.log("im validating extensions");
    if (req.body.fileExt) {
      req.body.fileExt = JSON.parse(req.body.fileExt);
      var errors = "";
      // console.log(req.body);
      // console.log(req.body.fileExt);
      if (!res.correctFields) res.correctFields = [];

      req.body.fileExt.forEach((element) => {
        if (element.formName !== "NULO") {
          if (acceptedTypes.indexOf(element.ext) === -1) {
            errors = `Formato del archivo subido no es valido. Tipos aceptados: '${acceptedTypes}'`;
            addErrors(res, errors, element.formName);

            console.log("no se acpeta");
            console.log(errors);
          } else {
            res.correctFields.push(element.formName);
          }
        }
      });
    }
    return next();
  };
};

module.exports.validateRequestFiles = (folder) => {
  return (req, res, next) => {
    console.log("Estoy en uploadFile");
    // console.log(req.body);
    let arrayBuffer = [];
    const storage = multer.memoryStorage();
    try {
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          console.log("estamos en el fileFilter");
          // console.log(req.body);
          console.log(file);
          var acceptedTypes = [".png", ".jpg", ".jpeg"];
          var ext = path.extname(file.originalname);
          // next();
          if (acceptedTypes.indexOf(ext) === -1) {
            console.log("no se acpeta");
            var errors = `Formato del archivo subido no es valido. \nTipos aceptados: "${acceptedTypes}""`;
            console.log(errors);
            addErrors(res, errors, file.fieldname);
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
      }).any();

      // upload.any();
      // validateRequest(req, res, validateRequest);
      upload(req, res, function () {
        console.log("Ya ejecute single");
        // console.log(req.body, req.files);
        if (req.files.length == 0) {
          console.log("No se subieron archivos");
          addErrors(res, "No se subieron los archivos solicitados", null);
        } else {
          let fileN =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            "." +
            req.files[0].mimetype.split("/")[1];
          req.body.pathFilesSaved = "";
          let res = {
            fileReadableStream: [],
          };
          for (let indexFile = 0; indexFile < req.files.length; indexFile++) {
            let fileN2 =
              Date.now() +
              "-" +
              Math.round(Math.random() * 1e9) +
              "." +
              req.files[indexFile].mimetype.split("/")[1];
            res.fileReadableStream.push({
              path: folder + "/" + fileN2,
              byteArray: req.files[indexFile].buffer,
            });
            req.body.pathFilesSaved =
              req.body.pathFilesSaved + folder + "/" + fileN2 + ";";
          }
          Promise.all(uploadFiles(res, req.app.storageFirebase))
            .then(() => {
              console.log(req.body.pathFilesSaved);
              next();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } catch (error) {
      console.log(`Falle al ejecutar algo: ${error}`);
    }
  };
};

function addErrors(res, msg, formName) {
  if (!res.errors) {
    res.errors = [];
  }
  res.errors.push(new requestError(msg, formName));
}
