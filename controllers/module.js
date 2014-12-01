var express = require('express');
var router = express.Router();
var fs = require('fs');
var moduleFactory = require("../module-builder");

var MODULES_FILE = "modules.json";

router.get("/moduleList", function (req, res) {
    fs.readFile(MODULES_FILE, function (err, data) {
        if (!err)
        {
            var modulesInfo = JSON.parse(data);
            var modules = [];

            for (var f = 0; f < modulesInfo.length; f++)
            {
                if (modulesInfo[f].out_ui)
                {
                    var ui = moduleFactory(modulesInfo[f]).out_ui()
                    console.log(ui);
                    modules.push(ui);
                }
            }

            res.send({status: "ok", modules: modules});
        }
        else
        {
            res.status(500).send({status: "error", messsage: "Can't read modules from list"});
        }
    });
});


module.exports = router;