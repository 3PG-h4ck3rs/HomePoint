(function(ns, undefined) {
    "use strict";


    function TempDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;
        setInterval($.proxy(this.updateTemp, this), 2000);
    }

    $.extend(TempDevice.prototype, ns.Device.prototype);

    TempDevice.prototype = $.extend(TempDevice.prototype, {
        updateTemp: function () {
            $.ajax({
                url: "/temp/api/getTemperature/" + this.deviceInfo.uuid,
                success: $.proxy(function(res){
                    this.dom.find(".temp").html(res.temp);
                }, this)
            })
        }
    });


    ns.registeredDevice["temp"] = TempDevice;
}(io.pible));
