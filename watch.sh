#!/bin/bash

trap 'jobs -p | xargs kill' EXIT

mkdir -p dist/css
mkdir -p dist/js

sass --watch scss:dist/css --sourcemap=none &
babel --presets es2015,react --out-dir dist/js/ --watch js/
