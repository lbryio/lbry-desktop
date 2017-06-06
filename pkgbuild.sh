#!/bin/sh
# .app creation
echo "Building .app"
sudo -H node_modules/.bin/build -m dir

#.pkg directory structure setup
echo "setting up directory structure"
mkdir ./pkg
cd ./pkg
mkdir -p flat/base.pkg flat/Resources/en.lproj
mkdir -p root/Applications

#copy .app to /Applications
echo "copying .app to /Applications"
sudo mv ../dist/mac/LBRY.app/ ./root/Applications

#create payload
echo "creating payload"
( cd root && find . | cpio -o --format odc --owner 0:80 | gzip -c ) > flat/base.pkg/Payload

#make bom
echo "creating bom file"
mkbom -u -0 -g 80 root flat/base.pkg/Bom

#xml setup
echo "setting up xml files"
touch ./flat/base.pkg/PackageInfo
touch ./flat/Distrubution
size=`du -k -s root | cut -f1`

#xml variable changing
cd ..
echo "enter version number"
read version
xmlstarlet ed --inplace -u "/pkg-info[@version]/@version" -v $version ./build/PackageInfo.xml
xmlstarlet ed --inplace -u "/pkg-info/payload[@installKBytes]/@installKBytes" -v $size ./build/PackageInfo.xml

#xml copying
cat ./build/PackageInfo.xml > ./pkg/flat/base.pkg/PackageInfo
cat ./build/Distribution.xml > ./pkg/flat/Distrubution

#creation of .pkg
cd ./pkg
( cd flat && xar --compression none -cf "../../LBRY.pkg" * )