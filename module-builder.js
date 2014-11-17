var fs = require("fs");
var MODULES_FILE = "../modules.json";

function Module(moduleInfo)
{
    var moduleClass = require("../devices/" + moduleInfo.type)
}


function ModuleBuilder()
{
    this.modulesCache = {};
    this.modulesInfo = JSON.parse(fs.readFileSync(MODULES_FILE));

    this.modulesInfo.foarEach(function(moduleInfo){

    });
}

ModuleBuilder.prototype = {
    getModule: function(id)
    {
        return this.modulesCache[id] || new Module(id);
    }
};

module.exports = ModuleBuilder;