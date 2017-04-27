#!/bin/sh
echo "Building .app"
sudo -H node_modules/.bin/build -m dir
sudo mv dist/mac/LBRY.app/ ./pkg
cd ./pkg
mkdir -p flat/base.pkg flat/Resources/en.lproj
mkdir -p root/Applications
sudo mv ./LBRY.app ./root/Applications
( cd root && find . | cpio -o --format odc --owner 0:80 | gzip -c ) > flat/base.pkg/Payload
touch ./flat/base.pkg/PackageInfo
echo packageinfo.xml > PackageInfo