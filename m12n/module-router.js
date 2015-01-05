var express = require('express');

var send = require("send");
var path = require("path");
var _ = require("lodash");

var modules = require("./module");

var include = require("../include");

include('utils.js');

function ModuleRouter()
{
    this.assetFolders = [];
}

ModuleRouter.prototype = {

    init: function (app) {
        app.use("/modules", express.static(path.join(__dirname, "../modules")));

        app.use("/modules-api/:moduleId/:method/*", function (req, res, next) {

            modules.getList(function (err, modules) {
                var arguments = _.map(req.params[0].split("/"), function (argument) {
                    var arg = argument;

                    if (arg === "true")
                        arg = true;

                    if (arg === "false")
                        arg = false;

                    return arg;
                });

                var module = modules[parseInt(req.params.moduleId)];

                module[req.params.method].apply(module, arguments);

                res.send({moduleId: req.params.moduleId, method: req.params.method, arguments: arguments});
            });
            
        });
    },

    addAssetsFolder: function (moduleName, folder) {
        var assetFolder = "/modules/" + moduleName + "/" + folder;

        if (this.assetFolders.indexOf(assetFolder) == -1)
            this.assetFolders.append(assetFolder);
    },

    router: function (req, res, next) {
        var pathComponents =  req.path.split("/");

        if (pathComponents[1] === "modules")
        {
            var moduleName = pathComponents[2];

            // remove the 'modules' and the module name
            pathComponents.splice(0, 3);

            var file = "./modules/" + moduleName + "/" + pathComponents.join("/");
            console.log("###", path.resolve(file));
            var stream = send(req, path.resolve(file));

            stream.on('error', function error(err) {
                console.log("Stream error");
                next(err.status === 404 ? null : err)
            });

            stream.pipe(res);
            return;
        }

        next();
    }
}

module.exports = new ModuleRouter();