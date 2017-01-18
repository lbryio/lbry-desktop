#! /bin/bash

set -o xtrace
set -eu

cd electron
npm install

cd ../lbry
git fetch
git reset --hard origin/master
git cherry-pick bd75e88ebebb67897c62a1ee1d3228fd269677dc
pip install -r requirements.txt
pip install .
git reset --hard origin/master

cd ../lbrynet
pyinstaller lbry.py -y --windowed --onefile --icon=../lbry/packaging/osx/lbry-osx-app/app.icns

cd ../lbry-web-ui
git fetch
git reset --hard origin/master
# git reset --hard origin/development
git cherry-pick 06224b1d2cf4bf1f63d95031502260dd9c3ec5c1
npm install
node_modules/.bin/node-sass --output dist/css --sourcemap=none scss/
node_modules/.bin/webpack
git reset --hard origin/master
# git reset --hard origin/development

cd ..
cp -R lbry-web-ui/dist electron/

mv lbrynet/dist/lbry electron/dist

echo 'Build complete. Run `electron electron` to launch the app'
