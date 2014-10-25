(function(ns, undefined) {
    "use strict";

    function Device(deviceInfo) {
        this.deviceInfo = deviceInfo;
        this.dom = null;
    }

    Device.prototype = {
        remove: function () {
            $.ajax({
                url: "/api/removeDevice/" + this.deviceInfo.uuid + "/" + this.deviceInfo.type,
                type: "delete",
                success: $.proxy(function () {
                    this.dom.remove();
                    ns.updateDeviceList();
                }, this)
            });
        },

        augmentDOM: function(dom){
            // should be implemented by children
        },

        getDOM: function (callback) {
            $.get("/" + this.deviceInfo.type + "/static/partials/dashboardItem.html", $.proxy(function (template) {
                this.dom = $(Mustache.render(template, this.deviceInfo));

                this.dom.find(".deviceName .fa-times").click($.proxy(this.remove, this));

                this.augmentDOM();

                callback.call(this, this.dom);
            }, this));
        }
    };

    ns.Device = Device;
    ns.registeredDevice = {};
}(io.pible));
