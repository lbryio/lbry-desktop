#!/bin/bash

set -o xtrace
set -eu

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if [ "$(uname)" == "Darwin" ]; then
    ICON="$ROOT/build/icon.icns"
else
    ICON="$ROOT/build/icons/lbry48.png"
fi

FULL_BUILD="${FULL_BUILD:-false}"
if [ -n "${TEAMCITY_VERSION:-}" ]; then
  FULL_BUILD="true"
elif [ -n "${APPVEYOR:-}" ]; then
  FULL_BUILD="true"
fi

if [ "$FULL_BUILD" == "true" ]; then
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
  python set_version.py
  python set_build.py
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

mv "$ROOT/lbrynet/dist/lbrynet-daemon" "$ROOT/app/dist"


if [ "$FULL_BUILD" == "true" ]; then
  if [ "$(uname)" == "Darwin" ]; then
    security unlock-keychain -p ${KEYCHAIN_PASSWORD} osx-build.keychain
  fi

  node_modules/.bin/build -p never

  echo 'Build and packaging complete.'
else
  echo 'Build complete. Run `./node_modules/.bin/electron app` to launch the app'
fi

if [ "$FULL_BUILD" == "true" ]; then
  # electron-build has a publish feature, but I had a hard time getting
  # it to reliably work and it also seemed difficult to configure. Not proud of
  # this, but it seemed better to write my own.
  pip install PyGithub uritemplate
  python release-on-tag.py
  deactivate
fi
