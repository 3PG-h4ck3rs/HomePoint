(function(ns) {
    "use strict";

    var dashboard = $("#dashboard");
    var dashboardItems = dashboard.find("#dashboardItems");
    var loadingIndicator = $("#dashboardLoading").find(".searchingIndicator");
    var emptyDashboardWidget = $("#emptyDashboard");

    var devices = [];

    ns.updateDeviceList = function () {
        $.ajax({
            url: "/module/moduleList",
            success: function (res) {
                loadingIndicator.hide();
                if (res.modules.length)
                {
                    emptyDashboardWidget.hide();
                    dashboard.show();

                    devices = _.clone(res.devices);
                    dashboardItems.empty();

                    for (var f = 0; f < res.modules.length; f++)
                    {
                        var module = res.modules[f];
                        dashboardItems.append(module);
                    }

//                    $.each(res.devices, function (index, deviceInfo) {
//                        var device = new ns.registeredDevice[deviceInfo.type](deviceInfo);
//
//                        device.getDOM(function (dom) {
//                            dashboardItems.append(dom);
//                        });
//                    });
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
