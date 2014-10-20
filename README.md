# PiBLE server

Tested on node v0.10.2

## Installation


### Install bluez

Install the required USB development packages by running:

    sudo apt-get install libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev

Next we have to manually compile and install BlueZ. Please replace the version number `5.23` with the latest
one found here: https://www.kernel.org/pub/linux/bluetooth

Make a directory we will place our bluetooth stuff inside:

    sudo mkdir /opt/bluetooth
    cd /opt/bluetooth

Download and unpack BlueZ:

    sudo wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.23.tar.gz
    sudo tar xvzf bluetooth/bluez-5.23.tar.gz

Remove the downloaded file (we keep the unpacked ones):

    sudo rm bluez-5.23.tar.gz

Configure, compile and install BlueZ (this may take some time!):

    cd bluez-5.23
    sudo ./configure --disable-systemd
    sudo make
    sudo make install

Once Bluez has been built, shut down your Raspberry Pi:

    sudo shutdown -h now

To check if the USB dongle it's available run:

    /opt/bluetooth/bluez-5.23/tools/hciconfig

It should give you a list of all Bluetooth Devices connected to your Raspberry Pi:

    hci0:   Type: BR/EDR  Bus: USB
        BD Address: 00:1A:7D:DA:71:08  ACL MTU: 310:10  SCO MTU: 64:8
        DOWN
        RX bytes:188952 acl:0 sco:0 events:4753 errors:0
        TX bytes:788 acl:0 sco:0 commands:57 errors:0

If all goes well, you should see the hci0 device (Host Controller Interface). BD Address is the Bluetooth address of
your Dongle as combination of 12 alphanumeric characters. The address is hexadecimal.

Next you can enable the device with the following command:

    sudo /opt/bluetooth/bluez-5.23/tools/hciconfig hci0 up

Check if it's running by using the `hciconfig` command again. The `DOWN` should have changed to `UP` and `RUNNING`:

    hci0:   Type: BR/EDR  Bus: USB
        BD Address: 00:1A:7D:DA:71:08  ACL MTU: 310:10  SCO MTU: 64:8
        UP RUNNING
        RX bytes:188952 acl:0 sco:0 events:4753 errors:0
        TX bytes:788 acl:0 sco:0 commands:57 errors:0

### Install node modules

In the folder where you downloaded the pible server run:

    npm install
