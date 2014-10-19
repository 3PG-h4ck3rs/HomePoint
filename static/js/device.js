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
            $.get("/static/partials/dashboardItem_" + this.deviceInfo.type + ".html", $.proxy(function (template) {
                this.dom = $(Mustache.render(template, this.deviceInfo));

                this.dom.find(".deviceName .fa-times").click($.proxy(this.remove, this));

                this.augmentDOM();

                callback.call(this, this.dom);
            }, this));
        }
    };


    function ToggleDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;
    }

    $.extend(ToggleDevice.prototype, Device.prototype);

    ToggleDevice.prototype = $.extend(ToggleDevice.prototype, {
        toggleState: function () {
            var state = $("[name=state]:checked").val();

            $.ajax({
                url: "/api/setState/" + this.deviceInfo.uuid + "/" + state,
                type: "post",
                success: $.proxy(function (res) {
                    if (state == "on")
                    {
                        this.dom.find(".onBtn").removeClass("btn-default").addClass("btn-primary");
                        this.dom.find(".offBtn").removeClass("btn-danger").addClass("btn-default");
                    }
                    else
                    {
                        this.dom.find(".onBtn").removeClass("btn-primary").addClass("btn-default");
                        this.dom.find(".offBtn").removeClass("btn-default").addClass("btn-danger");
                    }
                }, this)
            });
        },

        augmentDOM: function(){
            this.dom.find("[name=state]").on("change", $.proxy(this.toggleState, this));
            this.dom.find(".fa-calendar").click($.proxy(function(){
                this.dom.find(".scheduleDate").datepicker();
                this.dom.find(".scheduleTime").clockpicker({
                    placement: 'bottom',
                    autoclose: true,
                    'default': 'now'
                });
                $("#scheduleModal_" + this.deviceInfo.uuid).modal() ;
            }, this));
        }
    });

    function TempDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;
        setInterval($.proxy(this.updateTemp, this), 2000);
    }

    $.extend(TempDevice.prototype, Device.prototype);

    TempDevice.prototype = $.extend(TempDevice.prototype, {
        updateTemp: function () {
            $.ajax({
                url: "/api/getTemperature/" + this.deviceInfo.uuid,
                success: $.proxy(function(res){
                    this.dom.find(".temp").html(res.temp);
                }, this)
            })
        }
    });


    ns.ToggleDevice = ToggleDevice;
    ns.TempDevice = TempDevice;
}(io.pible));
