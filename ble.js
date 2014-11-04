var noble = require("noble");
var _ = require("lodash");

require("util").inherits(BLE, require("events").EventEmitter);

var ble = new BLE();

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
        console.log('Start BLE scanning ...');
    } else {
        noble.stopScanning();
        console.error('BLE failed to start');
    }
});

noble.on('discover',function(dev){
    process.stdout.write("Processing " + dev.advertisement.localName + "(" + dev.uuid + ") .");
    dev.connect(function(error){
        process.stdout.write(".");
        dev.discoverServices([], function(error, services) {
            process.stdout.write(".");
            dev.services = [];

            var servicesProcessed = 0;

            for (var f = 0; f < services.length; f++)
            {
                var service = services[f];

                (function (service) {
                    service.discoverCharacteristics([], function(error, characteristics){
                        service.chars = [];

                        for (var g = 0; g < characteristics.length; g++)
                        {
                            var char = characteristics[g];
                            service.chars[char.uuid] = char;
                        }

                        dev.services[service.uuid] = service;

                        servicesProcessed ++;

                        if (servicesProcessed == services.length)
                        {
                            ble.addDevice(dev);
                            process.stdout.write(" done\n");
                        }
                    });
                })(service);
            }
        });
    });

});


function simplifyDevice(device)
{
    var simpleDevice = {
        uuid: device.uuid,
        name: device.advertisement.localName,
        services: []
    };

    for (var serviceUUID in device.services)
    {
        var service = device.services[serviceUUID];

        var simpleService = {
            uuid: service.uuid,
            name: service.name || "N/A",
            type: service.type || "N/A",
            chars: []
        };

        for (var charUUID in service.chars)
        {
            var char = service.chars[charUUID];

            simpleService.chars.push({
                uuid: char.uuid,
                name: char.name || "N/A",
                type: char.type || "N/A"
            });
        }

        simpleDevice.services.push(simpleService);
    }

    return simpleDevice;
}

function BLE()
{
    this.devices = [];
}

BLE.prototype.addDevice = function (device) {
    this.devices[device.uuid] = device;
    this.emit("deviceDiscovered", simplifyDevice(device));
};

BLE.prototype.getDevices = function(){
    var devices = [];

    for (var f=0; f < this.devices.length; f++)
        devices.push(simplifyDevice(this.devices[f]));

    return devices;
};

BLE.prototype.sendCommand = function(deviceUUID, serviceUUID, charUUID, data, callback){
	
	var dev = this.devices[deviceUUID];

    if (!dev)
    {
        callback.call(this, {message: "Send command could not find device"});
        return;
    }

    var service = dev.services[serviceUUID];

    if (!service)
    {
        callback.call(this, {message: "Send command could not find service"});
        return;
    }

    var char = service.chars[charUUID];

    if (!char)
    {
        callback.call(this, {message: "Send command could not characteristic service"});
        return;
    }

    if (data)
        char.write(data, false, callback)
    else
        char.read(callback)
};

module.exports = ble;
