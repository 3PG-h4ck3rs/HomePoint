var fs = require("fs");
var _ = require("lodash");

var MODULES_FILE = "../modules.json";

function moduleFactory(moduleInfo, moduleID)
{
    if (moduleInfo.module)
    {
        var ModuleClass = require("./devices/" + moduleInfo.module + "/block");
        return new ModuleClass(moduleID);
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

            // Create the relations in between modules
            for (var f = 0; f < moduleInfo.relations.length; f++)
            {
                var relation = moduleInfo.relations[f];

                modules[relation.out.module][relation.out.method](function () {
                    modules[relation.in.module][relation.in.method].apply(modules[relation.in.module], arguments);
                });
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
                        proxyModule[method].apply(proxyModule, arguments);
                    };
                })(ioMethod);
            }

            return module;
        }
    }


}

module.exports = moduleFactory;