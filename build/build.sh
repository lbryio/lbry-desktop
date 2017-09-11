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
  echo -e "\033[1;31mPlatform detection failed\x1b[m"
  exit 1
fi

if $OSX; then
    ICON="$BUILD_DIR/icon.icns"
else
    ICON="$BUILD_DIR/icons/48x48.png"
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

[ -d "$ROOT/dist" ] && rm -rf "$ROOT/dist"
mkdir -p "$ROOT/dist"
[ -d "$ROOT/app/dist" ] && rm -rf "$ROOT/app/dist"
mkdir -p "$ROOT/app/dist"

yarn install



############
#    UI    #
############

(
  cd "$ROOT/ui"
  yarn install
  npm rebuild node-sass
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
DAEMON_VER=$(node -e "console.log(require(\"$ROOT/app/package.json\").lbrySettings.lbrynetDaemonVersion)")
DAEMON_URL_TEMPLATE=$(node -e "console.log(require(\"$ROOT/app/package.json\").lbrySettings.lbrynetDaemonUrlTemplate)")
DAEMON_URL=$(echo ${DAEMON_URL_TEMPLATE//DAEMONVER/$DAEMON_VER} | sed "s/OSNAME/$OSNAME/g")
DAEMON_VER_PATH="$BUILD_DIR/daemon.ver"
echo "$DAEMON_VER_PATH"
if [[ ! -f $DAEMON_VER_PATH || ! -f $ROOT/app/dist/lbrynet-daemon || "$(< "$DAEMON_VER_PATH")" != "$DAEMON_VER" ]]; then
    wget --quiet "$DAEMON_URL" -O "$BUILD_DIR/daemon.zip"
    unzip "$BUILD_DIR/daemon.zip" -d "$ROOT/app/dist/"
    rm "$BUILD_DIR/daemon.zip"
    echo "$DAEMON_VER" > "$DAEMON_VER_PATH"
else
    echo -e "\033[4;31mAlready have daemon version $DAEMON_VER, skipping download\x1b[m"
fi




###################
#  Build the app  #
###################

(
  cd "$ROOT/app"
  yarn install

  # necessary to ensure native Node modules (e.g. keytar) are built against the correct version of Node)
  # yes, it needs to be run twice. it fails the first time, not sure why
  set +e
  # DEBUG=electron-rebuild node_modules/.bin/electron-rebuild .
  node_modules/.bin/electron-rebuild "$ROOT/app"
  set -e
  node_modules/.bin/electron-rebuild "$ROOT/app"
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

  echo -e '\033[0;32mBuild and packaging complete.\x1b[m'
else
  echo -e 'Build complete. Run \033[1;31m./node_modules/.bin/electron app\x1b[m to launch the app'
fi
