var noble = require("noble");

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
    process.stdout.write("Connecting " + dev.advertisement.localName + " [" + dev.uuid + "] ... ");
    dev.connect(function(err){
        if (!err)
        {
            dev.discoverAllServicesAndCharacteristics(function(err, services, characteristics) {
                if (!err)
                {
                    dev.services = [];

                    for (var f = 0; f < services.length; f++)
                    {
                        var service = services[f];

                        service.chars = [];

                        for (var g = 0; g < characteristics.length; g++)
                        {
                            var char = characteristics[g];
                            service.chars[char.uuid] = char;
                        }

                        dev.services[service.uuid] = service;
                    }

                    ble.addDevice(dev);
                    process.stdout.write("done\n");

                }
                else
                {
                    console.error("Discovery failed for device", dev.uuid);
                }
            });
        }
        else
        {
            console.error("Device connection failed for device", dev.uuid);
        }
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
            name: service.name,
            type: service.type,
            chars: []
        };

        for (var charUUID in service.chars)
        {
            var char = service.chars[charUUID];

            simpleService.chars.push({
                uuid: char.uuid,
                name: char.name,
                type: char.type
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

    for (var deviceUUID in this.devices)
    {
        devices.push(simplifyDevice(this.devices[deviceUUID]));
    }

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
    {
        char.write(data, false, callback);
    }
    else
    {
        char.read(callback);
    }
};

module.exports = ble;
