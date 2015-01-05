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
        var router = express.Router();

        app.use("/modules", express.static(path.join(__dirname, "../modules")));

        router.post("/send", function (req, res) {

            var params = req.body;

            modules.getList(function (err, modules) {
                var module = modules[params.moduleId];

                module[params.method].apply(module, params.arguments);

                res.send({status: "ok"});
            });
        });

        app.use("/modules-api", router);
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