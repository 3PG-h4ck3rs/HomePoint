var express = require('express');
var router = express.Router();
var ble = require("../../ble");

router.get("/getState/:deviceId", function (req, res) {
    res.send({status:"ok", device: req.params.deviceId, state: "on"});
});

router.post("/setState/:deviceId/:state", function (req, res) {
    var state = req.params.state === "on" ? new Buffer([1]) : new Buffer([0]);

    ble.sendCommand(req.params.deviceId, '2220', '2222', state, function (err){
        if (!err)
        {
            res.send({status: "ok", state: req.params.state});
        }
        else
        {
            res.status(500).send({status: "error", message: err.message});
        }
    });
});

module.exports = router;