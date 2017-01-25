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
  pip install .
)

(
  cd "$ROOT/lbrynet"
  pyinstaller lbry.py -y --windowed --onefile --icon="${ICON}"
)

(
  cd "$ROOT/lbry-web-ui"
  npm install
  node_modules/.bin/node-sass --output dist/css --sourcemap=none scss/
  node_modules/.bin/webpack
)

cp -R "$ROOT/lbry-web-ui/dist" "$ROOT/electron/"

mv "$ROOT/lbrynet/dist/lbry" "$ROOT/electron/dist"

if [ -n "${TEAMCITY_VERSION:-}" ]; then
  electron-packager --electron-version=1.4.14 --overwrite "$ROOT/electron" LBRY --icon="${ICON}"
  # TODO: sign the app

  (
    cd "$ROOT/lbry"
    VERSION=$(python setup.py -V)
    cd "$ROOT"
    if [ "$(uname)" == "Darwin" ]; then
      PLATFORM="darwin"
      mv "LBRY-${PLATFORM}-x64/LBRY.app" "$ROOT/package/osx/LBRY.app"
      cd "$ROOT/package/osx/"
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
