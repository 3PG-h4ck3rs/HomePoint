var express = require('express');
var router = express.Router();
var _ = require('lodash');

var ble = require("../ble");

var fs = require('fs');

var mockDevices = [
    {
        "manufacturer": "Pible",
        "name": "Uber",
        "id": "00:00:00:00:00"
    },

    {
        "manufacturer": "Pible",
        "name": "Mini",
        "id": "00:00:00:00:01"
    },

    {
        "manufacturer": "Pible",
        "name": "Giugiuc",
        "id": "00:00:00:00:02"
    },
];

var DEVICES_FILE = "devices.json";
var SIMULATED_DELAY = 1000;

router.get("/discover", function (req, res) {	

    res.send({status: "ok", devices: ble.getDevices() });
});

router.post("/addDevice", function (req, res) {

    var devices;
    var device = req.body;

    if (!device)
    {
        res.status(400).send({status: "error", messsage: "Device not specified"});
        return;
    }

    fs.readFile(DEVICES_FILE, function (err, data) {

        if (!err)
        {
            devices = JSON.parse(data);
            var existingDevice = _.find(devices, function (item) {return item.uuid == device.uuid && item.type == device.type;});
            if (!existingDevice)
            {
                devices.push(device);

                fs.writeFile(DEVICES_FILE, JSON.stringify(devices), function (err) {
                    if (!err)
                        res.send({status: "ok", added: device});
                    else
                        res.status(500).send({status: "error", message:"Can't write device to file"});
                });
            }
            else
            {
                res.status(400).send({status: "error", messsage: "Device already added"});
                return;
            }
        }
        else
            res.status(500).send({status: "error", messsage: "Can't access devices file"});
    });
});

router.delete("/removeDevice/:deviceId/:deviceType", function (req, res) {
    fs.readFile(DEVICES_FILE, function (err, data) {
        if (!err)
        {
            var devices = JSON.parse(data);
            var newDevices = _.filter(devices, function (device) {
                return device.uuid != req.params.deviceId || device.type != req.params.deviceType;
            });

            if (devices.length != newDevices.length)
            {
                fs.writeFile(DEVICES_FILE, JSON.stringify(newDevices), function (err) {
                    if (!err)
                        res.send({status: "ok", removed: req.params.deviceId });
                    else
                        res.status(500).send({status: "error", message:"Can't write device to file"});
                });
            }
            else
                res.status(500).send({status: "error", message: "Device not found" });
        }
        else
            res.status(500).send({status: "error", messsage: "Can't read devices from list"});
    });
});

router.get("/deviceList", function (req, res) {
    fs.readFile(DEVICES_FILE, function (err, data) {
        if (!err)
            res.send({status: "ok", devices: JSON.parse(data) });
        else
            res.status(500).send({status: "error", messsage: "Can't read devices from list"});
    });
});

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
