#!/bin/bash

set -o xtrace
set -eu

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ "$(uname)" == "Darwin" ]; then
    ICON="$ROOT/package/osx/app.icns"
else
    ICON="$ROOT/package/icons/lbry48.png"
fi


if [ -n "${TEAMCITY_VERSION:-}" ]; then
  # install dependencies
  $ROOT/prebuild.sh

  VENV="$ROOT/build_venv"
  if [ -d "$VENV" ]; then
    rm -rf "$VENV"
  fi
  virtualenv "$VENV"
  set +u
  source "$VENV/bin/activate"
  set -u
  pip install -U pip setuptools
fi


(
  cd "$ROOT/electron"
  npm install
)

(
  cd "$ROOT/lbry"
  pip install -r requirements.txt
  # need to install our version of lbryum, not
  # what is currently on master
  pushd "$ROOT/lbryum"
  pip install .
  popd
  pip install .
)

(
  cd "$ROOT/lbrynet"
  pyinstaller lbry.onefile.spec -y --windowed --onefile
)

(
  cd "$ROOT/lbry-web-ui"
  npm install
  node_modules/.bin/node-sass --output dist/css --sourcemap=none scss/
  node_modules/.bin/webpack
  rm -rf "$ROOT/electron/dist"
  cp -r dist "$ROOT/electron/dist"
)

mv "$ROOT/lbrynet/dist/lbry" "$ROOT/electron/dist"


if [ -n "${TEAMCITY_VERSION:-}" ]; then
  electron-packager --electron-version=1.4.14 --overwrite "$ROOT/electron" LBRY --icon="${ICON}"

  (
    pushd "$ROOT/lbry"
    VERSION=$(python setup.py -V)
    popd
    if [ "$(uname)" == "Darwin" ]; then
      PLATFORM="darwin"
      rm -rf "$ROOT/package/osx/LBRY.app"
      mv "LBRY-${PLATFORM}-x64/LBRY.app" "$ROOT/package/osx/LBRY.app"
      cd "$ROOT/package/osx/"
      security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
      codesign --deep -s "${LBRY_DEVELOPER_ID}" -f LBRY.app
      # check if the signing actually worked
      codesign -vvv LBRY.app/
      dmgbuild -s dmg_settings.py "LBRY" "lbry-${VERSION}.dmg"
      mv "lbry-${VERSION}.dmg" "${ROOT}"
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      OS="linux"
      PLATFORM="linux"
      tar cvzf "lbry-${OS}.tgz" "LBRY-${PLATFORM}-x64/"
    else
      OS="unknown"
    fi
  )

  echo 'Build and packaging complete.'
else
  echo 'Build complete. Run `electron electron` to launch the app'
fi

if [ -n "${TEAMCITY_VERSION:-}" ]; then
  deactivate
fi
