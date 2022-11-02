var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Validator } = require("express-json-validator-middleware");

var usersRouter = require("./routes/users");
var registroRouter = require("./routes/registro");

var vacunasRouter = require("./routes/vacunas");
var publicacionget = require("./routes/PublicacionGetRouter");
var loginRouter = require("./routes/login");
var authRequired = require("./routes/authRequired");
var authRequiredModerador = require("./routes/authRequiredModerador");
var app = express();

const session = require("express-session");
const Protocolo = require("./models/Protocolo");
const sessionMiddleware = session({
  secret: "secrete",
  resave: true,
  saveUninitialized: true,
});
const cors = require("cors");
const { ValidationError } = require("./utils/ValidationError");

app.use(sessionMiddleware);
app.use(cors());
app.sessionReference = sessionMiddleware;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/inicio", indexRouter);
app.use("/petco", isLogged, authRequired);
app.use("/registro", registroRouter);
app.use("/moderador", authRequiredModerador);
//app.use("/formulario", formulariosRouter);
app.use("/login", loginRouter);
// app.use("/protocolo", ProtocoloRouter);
// app.use("/dashboard", dashboard);
app.use("/publicacion", publicacionget);
app.use("/videollamada", require("./routes/videollamada"));
app.use("/solicitudes", require("./routes/SolicitudesRouter"));

var enviroment = process.env.NODE_ENV || "development";
if (enviroment === "development") {
  require("dotenv").config();
}

function isLogged(req, res, next) {
  var IdSession = req.session.IdSession;
  // IdSession = 2;
  if (IdSession) {
    next();
  } else {
    if (res.permiso == true) {
      next();
    }
    return res.redirect("/login");
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

function validationErrorMiddleware(validationError, request, response, next) {
  if (response.headersSent) {
    return next(validationError);
  }

  const isValidationError = validationError instanceof ValidationError;
  if (!isValidationError) {
    return next(validationError);
  }
  console.log("Esta mal");
  response.status(400).json({
    errors: validationError.errors,
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
  if (err.status == 404) {
    console.log("http://" + req.hostname + ":3000/login");
    return res.redirect("/login");
  }
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
