(function (ns, undefined) {
    "use strict";

    var selectedDevice;
    var devices;

    var modal = $("#addDeviceModal");
    var modalError = $("#modalError");
    var loadingIndicator = $("#addDeviceModal .searchingIndicator");
    var emptyMessage = $("#addDeviceModal .emptyMessage");
    var deviceList = $("#addDeviceModal tbody");
    var deviceTable = $("#addDeviceModal table");
    var addDeviceBtn = $("#addDeviceBtn");

    function handleDeviceListChange()
    {
        addDeviceBtn.enable();
        selectedDevice = devices[$(this).val()];
    }


    function showError(text) {
        modalError.find("span").html(text);
        modalError.show();
    }

    function handleAddDevice()
    {
        var index = $("[name=selectedDevice]:checked").val();
        var device = devices[index];
        device.type = $("#deviceType_" + index).val();

        $.ajax({
            url: "/api/addDevice",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(selectedDevice),
            success: function (res) {
                ns.updateDeviceList();
                modal.modal('hide');
            },
            error: function (res) {
                if (res.responseJSON.messsage)
                    showError(res.responseJSON.messsage);
                else
                    showError("Unknown server error");
            }
        })
    }

    function showAddDeviceModal()
    {
        loadingIndicator.show();
        deviceTable.hide();
        modalError.hide();
        emptyMessage.hide();
        addDeviceBtn.disable();

        modal.modal();
		
        $.ajax({
            url: "/api/discover"
        }).success(function (res) {
            devices = res.devices;

            deviceList.empty();

            if (res.devices.length > 0)
            {
                $.get("/static/partials/admin/modalDeviceListRow.html", function (template) {
                    $.each(devices, function (index, device) {
                        var templateInfo =  _.clone(device);
                        templateInfo.index = index;

                        console.log("Found device:", templateInfo);

                        deviceList.append(Mustache.render(template, templateInfo));
                    });
                    loadingIndicator.hide();
                    deviceTable.show();
                });
            }
            else
            {
                loadingIndicator.hide();
                emptyMessage.show();
            }
        });

        var newDeviceEvents = new EventSource("/api/discover-event");

        newDeviceEvents.addEventListener("deviceDiscovered", function (event) {
            var device = JSON.parse(event.data);
            devices.push(device);

            $.get("/static/partials/admin/modalDeviceListRow.html", function (template) {
                var templateInfo =  _.clone(device);

                var index = deviceList.find("tr").length;

                templateInfo.index = index;

                console.log("Found device:", templateInfo);

                deviceList.append(Mustache.render(template, templateInfo));

                if (index === 0)
                {
                    emptyMessage.hide();
                    deviceTable.show();
                }
            });

        });
    }

    $(document).on("change", "[name='selectedDevice']", handleDeviceListChange);
    addDeviceBtn.click(handleAddDevice);

    $(".showDevicesBtn").click(showAddDeviceModal);

})(io.pible);
