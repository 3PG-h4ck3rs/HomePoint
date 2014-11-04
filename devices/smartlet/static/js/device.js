(function(ns, undefined) {
    "use strict";

    function ToggleDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;
    }

    $.extend(ToggleDevice.prototype, ns.Device.prototype);

    ToggleDevice.prototype = $.extend(ToggleDevice.prototype, {
        toggleState: function () {
            var state = $("[name=state]:checked").val();

            $.ajax({
                url: "/smartlet/api/setState/" + this.deviceInfo.uuid + "/" + state,
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


    ns.registeredDevice["smartlet"] = ToggleDevice;
}(io.pible));
