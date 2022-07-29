const multer = require("multer");
var path = require("path");
const { validationResult, Result } = require("express-validator");
const { ValidationError } = require("objection");

module.exports.uploadFile = (folder) => {
  return (req, res, next) => {
    console.log("Estoy en uploadFile");
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./public/${folder}`);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname +
            "-" +
            uniqueSuffix +
            "." +
            file.mimetype.split("/")[1]
        );
      },
    });
    try {
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var acceptedTypes = [".png", ".jpg", ".bmp", ".jpeg"];
          var ext = path.extname(file.originalname);
          if (acceptedTypes.indexOf(ext) === -1) {
            console.log("no se acpeta");
            var errors = `El tipo del archivo subido no es valido. \nTipo del archivo subido: "${ext}"\nTipos aceptados: "${acceptedTypes}"`;
            console.log(errors);
            // if (!res.errorsUpload) {
            //   res.errorsUpload = [];
            // }
            // errors.split("\n").forEach((element) => {
            //   res.errorsUpload.push(element);
            // });
            addErrors(res, errors.split("\n"));
            callback(null, false);
          } else callback(null, true);
        },
      }).any();
      upload(req, res, function () {
        console.log("Ya ejecute single");
        console.log(req.body, req.head, req.files);
        if (req.files.length == 0 && req.errorsUpload == null) {
          console.log("No se subieron archivos");
          addErrors(res, "No se subieron los archivos solicitados");
        }
        next();
      });
    } catch (error) {
      console.log(`Falle al ejecutar algo: ${error}`);
    }
  };
};

function addErrors(res, errors) {
  if (!res.errorsUpload) {
    res.errorsUpload = [];
  }
  res.errorsUpload.push(errors);
}
