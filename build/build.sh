#!/bin/bash

set -euo pipefail
set -x

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT"
BUILD_DIR="$ROOT/build"

LINUX=false
OSX=false
if [ "$(uname)" == "Darwin" ]; then
  OSX=true
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  LINUX=true
else
  echo "Platform detection failed"
  exit 1
fi

if $OSX; then
    ICON="$BUILD_DIR/icon.icns"
else
    ICON="$BUILD_DIR/icons/lbry48.png"
fi

FULL_BUILD="${FULL_BUILD:-false}"
if [ -n "${TEAMCITY_VERSION:-}" -o -n "${APPVEYOR:-}" ]; then
  FULL_BUILD="true"
fi

if [ "$FULL_BUILD" == "true" ]; then
  # install dependencies
  $BUILD_DIR/prebuild.sh

  VENV="$BUILD_DIR/venv"
  if [ -d "$VENV" ]; then
    rm -rf "$VENV"
  fi
  virtualenv "$VENV"
  set +u
  source "$VENV/bin/activate"
  set -u
  pip install -r "$BUILD_DIR/requirements.txt"
  python "$BUILD_DIR/set_version.py"
fi

libsecret="libsecret-1-dev"
if [ $LINUX -a -z "$(dpkg-query --show --showformat='${Status}\n' "$libsecret" 2>/dev/null | grep "install ok installed")" ]; then
  # this is needed for keytar, which does secure password/token management
  sudo apt-get install "$libsecret"
fi


[ -d "$ROOT/dist" ] && rm -rf "$ROOT/dist"
mkdir -p "$ROOT/dist"
[ -d "$ROOT/app/dist" ] && rm -rf "$ROOT/app/dist"
mkdir -p "$ROOT/app/dist"

npm install



############
#    UI    #
############

(
  cd "$ROOT/ui"
  npm install

  # necessary to ensure native Node modules (e.g. keytar) are built against the correct version of Node)
  # DEBUG=electron-rebuild node_modules/.bin/electron-rebuild .
  node_modules/.bin/electron-rebuild "$ROOT/ui"

  node extractLocals.js
  node_modules/.bin/node-sass --output dist/css --sourcemap=none scss/
  node_modules/.bin/webpack
  cp -r dist/* "$ROOT/app/dist/"
)



####################
#  daemon and cli  #
####################

if $OSX; then
  OSNAME="macos"
else
  OSNAME="linux"
fi
DAEMON_URL="$(cat "$BUILD_DIR/DAEMON_URL" | sed "s/OSNAME/${OSNAME}/")"
wget --quiet "$DAEMON_URL" -O "$BUILD_DIR/daemon.zip"
unzip "$BUILD_DIR/daemon.zip" -d "$ROOT/app/dist/"
rm "$BUILD_DIR/daemon.zip"

###################
#  Build the app  #
###################

(
  cd "$ROOT/app"
  npm install
)

if [ "$FULL_BUILD" == "true" ]; then
  if $OSX; then
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
  fi

  node_modules/.bin/build -p never

  if $OSX; then
    binary_name=$(find "$ROOT/dist" -iname "*dmg")
    new_name=$(basename "$binary_name" | sed 's/-/_/')
    mv "$binary_name" "$(dirname "$binary_name")/$new_name"
  fi

  # electron-build has a publish feature, but I had a hard time getting
  # it to reliably work and it also seemed difficult to configure. Not proud of
  # this, but it seemed better to write my own.
  python "$BUILD_DIR/upload_assets.py"

  deactivate

  echo 'Build and packaging complete.'
else
  echo 'Build complete. Run `./node_modules/.bin/electron app` to launch the app'
fi
