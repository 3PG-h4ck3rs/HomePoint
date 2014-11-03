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
    dev.connect(function(error){
        // Discover the service
        dev.discoverServices([], function(error, services) {
            dev.services = services;

            var servicesProcessed = 0;

            for (var f = 0; f < dev.services.length; f++)
            {
                (function (f) {
                    var service = dev.services[f];

                    service.discoverCharacteristics([], function(error, characteristics){
                        dev.services[f].chars = characteristics;

                        servicesProcessed++;

                        if (servicesProcessed == dev.services.length)
                        {
                            ble.addDevice(dev);
                            console.log("DISCOVERED:", dev.uuid," - ", dev.advertisement.localName);
                        }
                    });
                })(f);
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

    for (var f = 0; f < device.services.length; f++)
    {
        var service = device.services[f];

        var simpleService = {
            uuid: service.uuid,
            name: service.name || "N/A",
            type: service.type || "N/A",
            chars: []
        };

        for (var g = 0; g < service.chars.length; g++)
        {
            var char = service.chars[g];

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
    this.devices.push(device);
    this.emit("deviceDiscovered", simplifyDevice(device));
};

BLE.prototype.getDevices = function(){
    var devices = [];

    for (var f=0; f < this.devices.length; f++)
    {
        devices.push(simplifyDevice(this.devices[f]));
    }

    return devices;
};

BLE.prototype.sendCommand = function(uuid, serviceUUID, charUUID, data, callback){
	
	var dev = _.find(this.devices, function(device){
		return device.uuid == uuid;
	});

    if (!dev)
    {
        callback.call(this, {message: "Could not find device to send command to"});
        return;
    }

    var service = _.find(dev.services, function (service) {
        return service.uuid == serviceUUID;
    });

    var char = _.find(service.chars, function (charactheristic) {
        return charactheristic.uuid == charUUID;
    });

    if (data)
        char.write(data, false, callback)
    else
        char.read(callback)
};

module.exports = ble;
