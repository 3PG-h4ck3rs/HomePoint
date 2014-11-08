(function(ns) {
    "use strict";

    var deviceList = $("#deviceList");
    var deviceListItems = deviceList.find("tbody");
    var devicesWrap = $("#devices");
    var loadingIndicator = devicesWrap.find(".searchingIndicator");
    var emptyListWidget = devicesWrap.find("#emptylist");

    var devices = [];

    ns.updateDeviceList = function () {
        deviceList.hide();
        emptyListWidget.hide();
        loadingIndicator.show();

        $.ajax({
            url: "/api/deviceList",
            success: function (res) {
                if (res.devices.length)
                {
                    if (res.devices.length > 0)
                    {
                        devices = _.clone(res.devices);
                        deviceListItems.empty();

                        $.get("/static/partials/admin/deviceListRow.html", function (template) {
                            $.each(res.devices, function (index, deviceInfo) {
                                deviceInfo.index = index;
                                deviceListItems.append(Mustache.render(template, deviceInfo));
                            });

                            loadingIndicator.hide();
                            emptyListWidget.hide();
                            deviceList.show();
                        });
                    }
                }
                else
                {
                    loadingIndicator.hide();
                    deviceList.hide();
                    emptyListWidget.show();
                }

            }
        });
    };

    $(document).on("click", "#deviceList .deleteDevice", function () {
        var index = $(this).attr("data-index") | 0;
        var device = devices[index];

        $.ajax({
            url: "/api/removeDevice/" + device.uuid + "/" + device.type,
            type: "delete",
            success: $.proxy(function () {
                ns.updateDeviceList();
            }, this)
        });

    });

    ns.updateDeviceList();
}(io.pible));
