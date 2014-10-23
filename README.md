# PiBLE server

Tested on node v0.10.2

## Installation

All the following command must be runned in the pible server folder.

### Install Bluez

First we install the USB development packages and bluez:

    ./bin/install_bluez.sh

After the Pi reboots, to check if bluez installation succeeded, you can run:

    ./bin/ble_status.sh

### Install node modules

Finally, before we can run the server, we have to install the server dependencies:

    npm install


## Start the server

To start the server, just run;

    npm start
