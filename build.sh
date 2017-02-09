#!/bin/bash

set -o xtrace
set -eu

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ "$(uname)" == "Darwin" ]; then
    ICON="$ROOT/build/icon.icns"
else
    ICON="$ROOT/build/icons/lbry48.png"
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
  pip install -U pip setuptools pyinstaller
fi

npm install
pushd $ROOT/app
npm install
popd

pushd "$ROOT/lbry"
pip install -r requirements.txt
# need to install our version of lbryum, not
# what is currently on master
pushd "$ROOT/lbryum"
pip install .
popd
pip install .
popd

(
  cd "$ROOT/lbrynet"
  pyinstaller -y lbry.onefile.spec
)

(
  cd "$ROOT/lbry-web-ui"
  npm install
  node_modules/.bin/node-sass --output dist/css --sourcemap=none scss/
  node_modules/.bin/webpack
  rm -rf "$ROOT/app/dist"
  cp -r dist "$ROOT/app/dist"
)

mv "$ROOT/lbrynet/dist/lbry" "$ROOT/app/dist"


if [ -n "${TEAMCITY_VERSION:-}" ]; then
  if [ "$(uname)" == "Darwin" ]; then
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
  fi

  set +e
  export CI_BUILD_TAG=$(git describe --exact-match)
  set -e

  node_modules/.bin/build -p onTag
  
  echo 'Build and packaging complete.'
else
  echo 'Build complete. Run `./node_modules/.bin/electron app` to launch the app'
fi

if [ -n "${TEAMCITY_VERSION:-}" ]; then
  deactivate
fi
