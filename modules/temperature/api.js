var express = require('express');
var router = express.Router();
var ble = require("../../ble");

router.get("/getTemperature/:deviceId", function (req, res) {
    ble.sendCommand(req.params.deviceId, '2220', '2221', null, function (err, data){
        if (!err)
        {
            var temp = data.readUInt8(0, false) << 16 | data.readUInt16BE(1, false);
            res.send({status: "ok", temp: temp / 10});
        }
        else
            res.status(500).send({status: "error", message: "Bluetooth error"});
    });
});

module.exports = router;