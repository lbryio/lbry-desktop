#!/bin/bash

trap 'jobs -p | xargs kill' EXIT

mkdir -p dist/css
mkdir -p dist/js

sass --watch scss:dist/css --sourcemap=none &

if [ $1 != "jeremyisbadatnode" ]; then
  babel --presets es2015,react --out-dir dist/js/ --watch js/
else
  #yes I am dumb, but not a high prio fix - Jeremy
  babel --presets /home/jeremy/local/lib/node_modules/babel-preset-es2015,/home/jeremy/local/lib/node_modules/babel-preset-react --out-dir dist/js/ --watch ~/code/lbry-web-ui/js/
fi
