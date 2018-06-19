# LBRY App

[![Build Status](https://travis-ci.org/lbryio/lbry-app.svg?branch=master)](https://travis-ci.org/lbryio/lbry-app)
[![Dependencies](https://david-dm.org/lbryio/lbry-app/status.svg)](https://david-dm.org/lbryio/lbry-app)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/78b627d4f5524792adc48719835e1523)](https://www.codacy.com/app/LBRY/lbry-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lbryio/lbry-app&amp;utm_campaign=Badge_Grade)
[![chat on Discord](https://img.shields.io/discord/362322208485277697.svg?logo=discord)](https://discord.gg/U5aRyN6)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.io) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with an UI using
[Electron](http://electron.atom.io/).

![App screenshot](https://lbry.io/img/lbry-ui.png)

## Install

We provide installers for Windows, macOS (v10.9 or greater), and Debian-based Linux.

|                       | Windows                                      | macOS                                        | Linux                                        |
| --------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| Latest Stable Release | [Download](https://lbry.io/get/lbry.exe)     | [Download](https://lbry.io/get/lbry.dmg)     | [Download](https://lbry.io/get/lbry.deb)     |
| Latest Pre-release     | [Download](https://lbry.io/get/lbry.pre.exe) | [Download](https://lbry.io/get/lbry.pre.dmg) | [Download](https://lbry.io/get/lbry.pre.deb) |

Our [releases page](https://github.com/lbryio/lbry-app/releases) also contains the latest
release, pre-releases, and past builds.

To install from source or make changes to the application, continue reading below.

## Usage
Double click the installed application to browse with the LBRY network.

## Running from Source

#### Prerequisites

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/) (Use Node v8 if having trouble with keytar)
* [Yarn](https://yarnpkg.com/en/docs/install)
* [C++ Build Tools](https://github.com/felixrieseberg/windows-build-tools) (Windows only, only install if having trouble with keytar)

#### Steps

1. Clone this repository: `git clone https://github.com/lbryio/lbry-app`
2. Change directories into the downloaded folder: `cd lbry-app`
3. Install the dependencies: `yarn`
4. Run the app: `yarn dev`

If you want to just build the app you can run `yarn build`. This will give you an executable inside the `/dist` folder. We use [electron-builder](https://github.com/electron-userland/electron-builder) to create
distributable packages.

#### Resetting your Packages

If the app isn't building, or `yarn xxx` commands aren't working you may need to just reset your `node_modules`. To do so you can run: `rm -r node_modules && yarn` or `del /s /q node_modules && yarn` on Windows. 

## Contributing

Contributions to this project are welcome, encouraged, and compensated. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is MIT licensed. For the full license, see [LICENSE](LICENSE)

## Security

We take security seriously. Please contact security@lbry.io regarding any security issues. Our PGP key is [here](https://keybase.io/lbry/key.asc) if you need it.

## Contact

The primary contact for this project is [@seanyesmunt](https://github.com/seanyesmunt)
