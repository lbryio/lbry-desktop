#!/bin/bash

set -euo pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$ROOT"
BUILD_DIR="$ROOT/build"

LINUX=false
OSX=false
if [ "$(uname)" == "Darwin" ]; then
  echo -e "\033[0;32mBuilding for OSX\x1b[m"
  OSX=true
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  echo -e "\033[0;32mBuilding for Linux\x1b[m"
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

DEPS="${DEPS:-$FULL_BUILD}"
if [ "$DEPS" != "true" ]; then
  echo -e "\033[1;36mDependencies will NOT be installed. Run with \"INSTALL_DEPENDENCIES=true\" to install dependencies, or \"FULL_BUILD=true\" to install dependencies and build a complete app.\x1b[m"
else
  # install dependencies
  echo -e "\033[0;32mInstalling Dependencies\x1b[m"
  "$BUILD_DIR/install_deps.sh"
fi

[ -d "$ROOT/dist" ] && rm -rf "$ROOT/dist"

yarn install

####################
#  daemon and cli  #
####################
echo -e "\033[0;32mGrabbing Daemon and CLI\x1b[m"
if $OSX; then
  OSNAME="macos"
else
  OSNAME="linux"
fi
DAEMON_VER=$(node -e "console.log(require(\"$ROOT/package.json\").lbrySettings.lbrynetDaemonVersion)")
DAEMON_URL_TEMPLATE=$(node -e "console.log(require(\"$ROOT/package.json\").lbrySettings.lbrynetDaemonUrlTemplate)")
DAEMON_URL=$(echo ${DAEMON_URL_TEMPLATE//DAEMONVER/$DAEMON_VER} | sed "s/OSNAME/$OSNAME/g")
DAEMON_VER_PATH="$BUILD_DIR/daemon.ver"
echo "$DAEMON_VER_PATH"
if [[ ! -f $DAEMON_VER_PATH || ! -f $ROOT/static/daemon/lbrynet-daemon || "$(< "$DAEMON_VER_PATH")" != "$DAEMON_VER" ]]; then
    curl -sL -o "$BUILD_DIR/daemon.zip" "$DAEMON_URL"
    unzip "$BUILD_DIR/daemon.zip" -d "$ROOT/static/daemon/"
    rm "$BUILD_DIR/daemon.zip"
    echo "$DAEMON_VER" > "$DAEMON_VER_PATH"
else
    echo -e "\033[4;31mAlready have daemon version $DAEMON_VER, skipping download\x1b[m"
fi




###################
#  Build the app  #
###################
if [ "$FULL_BUILD" == "true" ]; then
  if $OSX; then
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
  fi

  yarn build

  # Workaround: TeamCity expects the dmg to be in dist/mac, but in the new electron-builder
  # it's put directly in dist/ (the right way to solve this is to update the TeamCity config)
  if $OSX; then
    cp dist/*.dmg dist/mac
  fi

  # electron-build has a publish feature, but I had a hard time getting
  # it to reliably work and it also seemed difficult to configure. Not proud of
  # this, but it seemed better to write my own.
  VENV="$BUILD_DIR/venv"
  if [ -d "$VENV" ]; then
    rm -rf "$VENV"
  fi
  virtualenv "$VENV"
  "$VENV/bin/pip" install -r "$BUILD_DIR/requirements.txt"
  "$VENV/bin/python" "$BUILD_DIR/upload_assets.py"

  echo -e '\033[0;32mBuild and packaging complete.\x1b[m'
else
  echo -e 'Build complete. Run \033[1;31myarn dev\x1b[m to launch the app'
fi
