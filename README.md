# LBRY Pi TV

[![Build Status](https://travis-ci.org/lbryio/lbry-desktop.svg?branch=master)](https://travis-ci.org/lbryio/lbry-desktop)
[![Dependencies](https://david-dm.org/lbryio/lbry-desktop/status.svg)](https://david-dm.org/lbryio/lbry-desktop)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/78b627d4f5524792adc48719835e1523)](https://www.codacy.com/app/LBRY/lbry-desktop?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lbryio/lbry-desktop&amp;utm_campaign=Badge_Grade)
[![chat on Discord](https://img.shields.io/discord/362322208485277697.svg?logo=discord)](https://chat.lbry.io)

[![forthebadge](https://forthebadge.com/images/badges/certified-steve-bruhle.svg)](https://forthebadge.com)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.io) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with an UI using
[Electron](http://electron.atom.io/).

![App GIF](https://spee.ch/7/lbry-redesign-preview.gif)

## Install

We provide installers for Raspberry Pi 3
| Linux                                        
| -------------------------------------------- |
| [Download](https://lbry.io/get/lbry.deb)

Our [releases page](https://github.com/lbryio/lbry-desktop/releases) also contains the latest
release, pre-releases, and past builds.   
*Note: If the deb fails to install using the Ubuntu Software Center, install manually via `sudo dpkg -i <path to deb>`. You'll need to run `sudo apt-get install -f` if this is the first time installing it to install dependencies*

To install from source or make changes to the application, continue to the next section below.   
## Usage
Double click the installed application to browse with the LBRY network.

## Running from Source

#### Prerequisites

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/) (Use Node v8 if having trouble with keytar)
* [Yarn](https://yarnpkg.com/en/docs/install)
* [C++ Build Tools](https://github.com/felixrieseberg/windows-build-tools) (Windows only, only install if having trouble with keytar)

#### Steps

1. Clone (or [fork](https://help.github.com/articles/fork-a-repo/)) this repository: `git clone https://github.com/kodxana/LBRY-Pi-TV`
2. Change directories into the downloaded folder: `cd LBRY-Pi-TV`
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
