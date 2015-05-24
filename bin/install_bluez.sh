#!/bin/bash

sudo apt-get install libusb-dev libdbus-1-dev libglib2.0-dev libudev-dev libical-dev libreadline-dev

sudo mkdir /opt/bluetooth
cd /opt/bluetooth

sudo wget https://www.kernel.org/pub/linux/bluetooth/bluez-5.23.tar.gz
sudo tar xvzf bluez-5.23.tar.gz

sudo rm bluez-5.23.tar.gz

cd bluez-5.23
sudo ./configure --disable-systemd
sudo make
sudo make install

while true; do
    read -p "Do you wish to reboot now ? [y/n]:" yn
    case $yn in
        [Yy]* ) sudo reboot; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y for 'yes' or n for 'no'.";;
    esac
done
