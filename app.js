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
var vacunasRouter = require("./routes/vacunas");
var formulariosRouter = require("./routes/formulariosRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/registro", registroRouter);
app.use("/ve", vacunasRouter);
app.use("/formulario", formulariosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
