#!/bin/sh

sudo apt-get install libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev

sudo mkdir /opt/bluetooth
cd /opt/bluetooth

sudo wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.23.tar.gz
sudo tar xvzf bluetooth/bluez-5.23.tar.gz

sudo rm bluez-5.23.tar.gz

cd bluez-5.23
sudo ./configure --disable-systemd
sudo make
sudo make install

sudo reboot