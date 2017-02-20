# LBRY App

A decentralized content marketplace built on top of the [lbry protocol](https://github.com/lbryio/lbry)

Check out the [release page](https://github.com/lbryio/lbry-app/releases/latest) to get started.


## Development

This repo uses submodules, so clone it using --recursive

We do most of our development work on linux and macOS so we don't have
any instructions for creating a development setup on windows.  You can
checkout out the build steps in [appveyor.yml](https://github.com/lbryio/lbry-app/blob/master/appveyor.yml) and probably figure out something from there.

### Setup

The
[lbrynet library](https://github.com/lbryio/lbry/blob/master/INSTALL.md) needs
to be installed along with pyinstaller. You also need to be
able to build the lbry-web-ui, so have node, webpack, etc installed.

### Build

run `./build.sh`

This builds the UI assets and puts them into `app/dist`. It also builds `app/dist/lbrynet-daemon`.

### Run

`./node_modules/.bin/electron app`

### Package

We use [electron-builder](https://github.com/electron-userland/electron-builder)
to create distributable packages, which is run by calling:

`node_modules/.bin/build -p never`
