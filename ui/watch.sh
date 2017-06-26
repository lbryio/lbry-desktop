#!/bin/bash

set -euo pipefail
#set -x

#trap 'kill $(jobs -p)' EXIT # IS THIS NECESSARY? on linux, it kills all child processes when you ctrl-c

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

(
  cd "$DIR"
  mkdir -p $DIR/dist/css
  mkdir -p $DIR/dist/js

  if [ ! -d "$DIR/node_modules" ]; then
    echo "Installing NPM modules"
    yarn install
  fi

  # run sass once without --watch to force update. then run with --watch to keep watching
  node_modules/.bin/node-sass --output $DIR/../app/dist/css --sourcemap=none $DIR/scss/
  node_modules/.bin/node-sass --output $DIR/../app/dist/css --sourcemap=none --watch $DIR/scss/ &

  node_modules/.bin/webpack --config webpack.dev.config.js --progress --colors --watch
)