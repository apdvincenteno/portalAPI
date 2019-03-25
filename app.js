var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var mongoose = require("mongoose");

var passport = require("passport");
require("dotenv").config();
// mongoose database
console.log('db', process.env.CONNECT_LOCAL_DB)
mongoose.connect(
  process.env.CONNECT_LOCAL_DB,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log("\x1b[31m%s\x1b[0m", "error failed to conenct");
    } else {
      console.log("\x1b[32m%s\x1b[0m", "Connected to the Database");
    }
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// middleware
// Express Session
app.use(
  session({
    secret: process.env.APP_SECRET,
    saveUninitialized: true,
    resave: true
  })
);


var flash = require('connect-flash');
app.use(flash());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Passport init
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);

//models



// routes
var auth = require('./routes/users')(passport);
app.use("/", indexRouter);
app.use("/api/", require('./routes/auth'));
app.use("/users", require("./routes/users"));
app.use("/api", auth);
// end of routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
