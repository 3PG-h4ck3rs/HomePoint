(function(ns) {
    "use strict";

    var dashboard = $("#dashboard");
    var dashboardItems = dashboard.find("#dashboardItems");
    var loadingIndicator = $("#dashboardLoading").find(".searchingIndicator");
    var emptyDashboardWidget = $("#emptyDashboard");

    var devices = [];

    ns.updateDeviceList = function () {
        $.ajax({
            url: "/api/deviceList",
            success: function (res) {
                loadingIndicator.hide();
                if (res.devices.length)
                {
                    emptyDashboardWidget.hide();
                    dashboard.show();

                    if (res.devices.length !== devices.length)
                    {
                        devices = _.clone(res.devices);
                        dashboardItems.empty();

                        $.each(res.devices, function (index, deviceInfo) {
                            var device = new ns.registeredDevice[deviceInfo.type](deviceInfo);

                            device.getDOM(function (dom) {
                                dashboardItems.append(dom);
                            });
                        });
                    }
                }
                else
                {
                    dashboard.hide();
                    emptyDashboardWidget.show();
                }

            }
        });
    };

	ns.updateDeviceList();
//    setInterval(ns.updateDeviceList, 1000);
}(io.pible));
