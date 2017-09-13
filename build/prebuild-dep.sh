#!/bin/bash
#############################################################
#  Install All Components to Compile For Linux And Windows  #
#      Made For Ubuntu but could work on other distros      #
#############################################################

#############################################################
# if this is a fresh install run "sudo passwd root" to set  #
# the super user password then run "su" to get root access  #
#          to the terminal then run this script             #
#############################################################

# Variables
installa="sudo apt install -y"
installb="sudo apt"
installc="sudo npm install"
installd="sudo pip install"

# start install of Dependencies
echo -e "\033[1;32mGetting Needed Dependencies for Compiling Lbry-app...\x1b[m"
sleep 5
$installb update
$installa build-essential
$installa software-properties-common
sudo dpkg --add-architecture i386
$installa libsecret-1-dev
$installa libssl-dev
$installa libffi-dev
$installa libgmp3-dev
$installa python2.7-dev
$installb update
$installa graphicsmagick xz-utils
$installb update
wget -nc https://dl.winehq.org/wine-builds/Release.key
sudo apt-key add Release.key
sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/
$installb update
$installa wine1.8
$installa wine32
$installa winehq-stable
$installa winetricks
$installa mono-complete
$installa unzip
$installd setuptools
$installd virtualenv
$installd curl
$installa gcc
$installa git git-core
$installb update
cd /usr/local
sudo wget https://nodejs.org/dist/v7.10.1/node-v7.10.1-linux-x64.tar.gz
sudo tar --strip-components 1 -xzf node-v7.10.1-linux-x64.tar.gz
sudo rm -f -r node-v7.10.1-linux-x64.tar.gz
$installb update
$installa npm
$installc electron-prebuilt -g
$installc -g yarn
$installb update
echo -e "\033[1;32mCompiling Dependencies Download/Install Completed\x1b[m"
echo -e "\033[1;31mif you encountered an error make sure youre running terminal under su\x1b[m"
sleep 5
echo -e "run \033[0;32mcd /lbry-app\x1b[m then \033[0;32m./build.sh\x1b[m to compile the app"
echo -e "running \033[0;32mnode_modules/.bin/build -wl -p never\x1b[m will compile for Linux and Windows"
