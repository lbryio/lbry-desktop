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

###################
#  Build the app  #
###################
if [ "$FULL_BUILD" == "true" ]; then
  if $OSX; then
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
  fi

  yarn build

  echo -e '\033[0;32mBuild and packaging complete.\x1b[m'
else
  echo -e 'Build complete. Run \033[1;31myarn dev\x1b[m to launch the app'
fi
