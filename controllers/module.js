var express = require('express');
var router = express.Router();
var fs = require('fs');
var modules = require("../m12n/module");

router.get("/moduleList", function (req, res) {
    modules.getList(function (err, modules) {
        if (!err)
        {
            var modulesUI = [];

            for (var f = 0; f < modules.length; f++)
            {
                modulesUI.push(modules[f].out_ui());
            }

            res.send({status: "ok", modules: modulesUI});
        }
        else
        {
            res.status(500).send({status: "error", message: "Can't read modules from list"});
        }
    })
});


module.exports = router;