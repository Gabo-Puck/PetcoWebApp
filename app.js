var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const {
  Validator,
  ValidationError,
} = require("express-json-validator-middleware");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var registroRouter = require("./routes/registro");
var ProtocoloRouter = require("./routes/protocolos");
var vacunasRouter = require("./routes/vacunas");
var formulariosRouter = require("./routes/formulariosRouter");
var loginRouter = require("./routes/login");
var authRequired = require("./routes/authRequired");
var publicaciones = require("./routes/publicaciones");

var app = express();

const session = require("express-session");
const Protocolo = require("./models/Protocolo");
app.use(
  session({
    secret: "secrete",
    resave: true,
    saveUninitialized: true,
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/inicio", indexRouter);
app.use("/petco", isLogged, authRequired);
app.use("/registro", registroRouter);
//app.use("/formulario", formulariosRouter);
app.use("/login", loginRouter);
app.use("/protocolo", ProtocoloRouter);
app.use("/publicaciones", publicaciones);

function isLogged(req, res, next) {
  var IdSession = req.session.IdSession;
  if (IdSession) {
    next();
  } else {
    if (res.permiso == true) {
      next();
    }
    return res.redirect("http://localhost:3000/login");
  }
}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
  // console.log("X");
});

app.use(function (req, res, next) {
  try {
    next();
  } catch (error) {
    console.log(error);
    // console.log("D");
  }
});

function validationErrorMiddleware(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }

  response.status(400).json({
    errors: error.validationErrors,
  });

  next();
}

app.use(validationErrorMiddleware);

app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log("rees");
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
