# LBRY Electron

An electron version of the LBRY application.

This repo uses submodules, so clone it using --recursive

## Setup

The lbrynet needs to be installed along with pyinstaller, and you
need everything to be able to build the lbry-web-ui

## Build

run `./build.sh` to create a lbry executable, bundle the front-end and move
everything into the the electron repo

## Run

`electron electron`

## Package

To build a distributable package for OSX, run (on an OSX machine):

`electron-packager --electron-version=1.4.14 --overwrite electron LBRY`

This also probably works for windows and linux, but I haven't tested it

## TODO

This app works by launching the lbrynet daemon in a seperate process.  Currently the
process management is very poor and the lbrynet process might not be shut-down when the app
is closed. Also, if the lbrynet daemon dies, there is no attempt to restart it.
