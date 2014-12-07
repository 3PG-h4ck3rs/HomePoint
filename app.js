var express = require("express");

var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var nunjucks  = require("nunjucks");

var fs = require("fs");

var app = express();

var modulesScripts = [];

var moduleRouter = require("./m12n/module-router");


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "nunjucks");

nunjucks.configure("views", {
    autoescape: true,
    express   : app
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "static")));


// expose module names to the views
app.use(function(req,res,next){
    res.locals.modulesScripts = modulesScripts;
    next();
});

app.use("/",        require("./controllers/main"));
app.use("/admin",   require("./controllers/admin"));
app.use("/api",     require("./controllers/api"));
app.use("/module",  require("./controllers/module"));

moduleRouter.init(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render("error.html", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render("error.html", {
        message: err.message,
        error: {}
    });
});


module.exports = app;
