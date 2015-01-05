var fs = require("fs");
var _ = require("lodash");
var crypto = require('crypto');

var MODULES_FILE = "modules.json";

function moduleFactory(moduleInfo)
{
    if (moduleInfo.module)
    {
        var ModuleClass = require("../modules/" + moduleInfo.module + "/block");
        return new ModuleClass(moduleInfo.options);
    }
    else
    {
        if (moduleInfo.modules)
        {
            // Instantiate all the external modules
            var modules = {};
            for (var moduleID in moduleInfo.modules)
            {
                modules[moduleID] = moduleFactory(moduleInfo.modules[moduleID], moduleID);
            }

            if (moduleInfo.relations)
            {
                // Create the relations in between modules
                for (var f = 0; f < moduleInfo.relations.length; f++)
                {
                    var relation = moduleInfo.relations[f];

                    modules[relation.out.module][relation.out.method](function () {
                        modules[relation.in.module][relation.in.method].apply(modules[relation.in.module], arguments);
                    });
                }
            }

            // Create the wrapper module
            var module = {};

            var moduleIOMethods = _.pick(moduleInfo, function (module, method) {
                return method.match(/^(?:in|out)_\w*$/);
            });

            // Create the proxy methods for the wrapper module
            for (var ioMethod in moduleIOMethods)
            {
                (function (method) {
                    module[method] = function(){
                        var proxyModule = modules[moduleIOMethods[method]];
                        return proxyModule[method].apply(proxyModule, arguments);
                    };
                })(ioMethod);
            }

            return module;
        }
    }
}

function Module()
{
    this.checksum = null;
    this.modules = [];
}

Module.prototype = {
    getList: function (callback) {
        fs.readFile(MODULES_FILE, function (err, data) {
            if (!err)
            {
                var checksum = crypto.createHash('md5').update(data).digest('hex');

                if (!this.checksum || this.checksum != checksum)
                {
                    this.checksum = checksum;
                    this.modules = [];

                    var modulesInfo = JSON.parse(data);

                    for (var f = 0; f < modulesInfo.length; f++)
                    {
                        if (modulesInfo[f].out_ui)
                        {
                            var ui = moduleFactory(modulesInfo[f]);
                            this.modules.push(ui);
                        }
                    }
                }

                callback.call(this, null, this.modules);
            }
            else
            {
                callback.call(this, err);
            }
        });

    }
}


module.exports = new Module();
module.exports.factory = moduleFactory;