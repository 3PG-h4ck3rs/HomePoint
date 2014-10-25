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
	console.log("DISCOVERED:", dev.uuid," - ", dev.advertisement.localName);	
	ble.devices.push(dev);
    ble.emit("deviceDiscovered", {
        uuid: dev.uuid,
        name: dev.advertisement.localName
    });
});


function BLE()
{
	this.devices = [];
}

BLE.prototype.getDevices = function(){
	var devices = [];

	for (var f=0; f < this.devices.length; f++)
	{
		devices.push({
			uuid: this.devices[f].uuid,
			name: this.devices[f].advertisement.localName
		});
	}

	return devices;
};

BLE.prototype.sendCommand = function(uuid, service, characteristic, data, callback){
	
	var dev = _.find(this.devices, function(device){
		return device.uuid == uuid;
	});

    dev.connect(function(error){
		// Discover the service
		dev.discoverServices([service], function(error, services) {
			var testService = services[0];

			// discover the characteristic
			testService.discoverCharacteristics([characteristic], function(error, characteristics) {
				var testCharacteristic = characteristics[0];

                if (data)
				    testCharacteristic.write(data, false, callback);
                else
                    testCharacteristic.read(callback);
			});
		});
	});
}

module.exports = ble;
