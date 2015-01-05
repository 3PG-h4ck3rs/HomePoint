var ble = require("../../ble");

function SmartletBlock(options)
{
    this.options = options;
}

SmartletBlock.prototype = {
    in_bool: function (value) {
        var state = value ? new Buffer([1]) : new Buffer([0]);

        ble.sendCommand(this.options.deviceID, '2220', '2222', state, function (err)
        {
            if (!err)
            {
                if (this.callback)
                {
                    this.callback.call(this, value);
                }
            }
        });
    },

    out_bool: function(callback)
    {
        this.callback = callback;
    }
};

module.exports = SmartletBlock;

