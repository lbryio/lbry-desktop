# LBRY App

This is a graphical browser for the decentralized content marketplace provided by the [LBRY](https://lbry.io) protocol. It is essentially the [lbry daemon](https://github.com/lbryio/lbry) bundled with a UI using [Electron](http://electron.atom.io/).

## Installing

We provide installers for Windows, macOS, and Debian-based Linux.

| Windows | macOS | Linux |
| --- | --- | --- |
| [Download](https://lbry.io/get/lbry.exe) | [Download](https://lbry.io/get/lbry.dmg) | [Download](https://lbry.io/get/lbry.deb) |

Our [releases page](https://github.com/lbryio/lbry-app/releases/latest) also contains the latest release, pre-releases, and past builds.

To install from source or make changes to the application, continue reading below.

## Development

This repo uses submodules, so clone it using `--recursive`.

### Setup

The
[lbry daemon](https://github.com/lbryio/lbry/blob/master/INSTALL.md) needs
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

note, if you are building for macos on a linux machine you need to run

`./pkgbuild.sh`

### Development on Windows

This project has currently only been worked on in Linux and macOS. If you are on Windows, you can
checkout out the build steps in [appveyor.yml](https://github.com/lbryio/lbry-app/blob/master/.appveyor.yml) and probably figure out something from there.
