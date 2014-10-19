(function(ns, undefined) {
    "use strict";

    var dashboard = $("#dashboard");
    var dashboardItems = $("#dashboard #dashboardItems");
    var loadingIndicator = $("#dashboardLoading .searchingIndicator");
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

                    if (res.devices.length != devices.length)
                    {
                        devices = _.clone(res.devices);
                        dashboardItems.empty();

                        $.each(res.devices, function (index, deviceInfo) {
                            var device;

                            switch (deviceInfo.type){
                                case 'toggle':
                                    device = new ns.ToggleDevice(deviceInfo);
                                    break;
                                case 'temp':
                                    device = new ns.TempDevice(deviceInfo);
                                    break;
                            }

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
