var express = require('express');
var router = express.Router();
var _ = require('lodash');

var ble = require("../ble");

var fs = require('fs');

var EventSource = require("../event-source");

var DEVICES_FILE = "devices/added.json";

router.get("/discover", function (req, res) {
    res.send({status: "ok", devices: ble.getDevices() });
});

router.get("/discover-event", function (req, res) {
    var discoverEvent = new EventSource(res);

    function handleDeviceDiscovered(device)
    {
        discoverEvent.send("deviceDiscovered", device);
    }

    ble.on("deviceDiscovered", handleDeviceDiscovered);

    req.once("end", function() {
        ble.removeListener("deviceDiscovered", handleDeviceDiscovered);
    });
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
                    {
                        res.send({status: "ok", added: device});
                    }
                    else
                    {
                        res.status(500).send({status: "error", message:"Can't write device to file"});
                    }
                });
            }
            else
            {
                res.status(400).send({status: "error", message: "Device already added"});
            }
        }
        else
        {
            res.status(500).send({status: "error", message: "Can't access devices file"});
        }
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
                    {
                        res.send({status: "ok", removed: req.params.deviceId });
                    }
                    else
                    {
                        res.status(500).send({status: "error", message:"Can't write device to file"});
                    }
                });
            }
            else
            {
                res.status(500).send({status: "error", message: "Device not found" });
            }
        }
        else
        {
            res.status(500).send({status: "error", message: "Can't read devices from list"});
        }
    });
});

router.get("/deviceList", function (req, res) {
    fs.readFile(DEVICES_FILE, function (err, data) {
        if (!err)
        {
            res.send({status: "ok", devices: JSON.parse(data) });
        }
        else
        {
            res.status(500).send({status: "error", messsage: "Can't read devices from list"});
        }
    });
});

module.exports = router;
