# LBRY App

[![Build Status](https://travis-ci.org/lbryio/lbry-desktop.svg?branch=master)](https://travis-ci.org/lbryio/lbry-desktop)
[![Dependencies](https://david-dm.org/lbryio/lbry-desktop/status.svg)](https://david-dm.org/lbryio/lbry-desktop)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/78b627d4f5524792adc48719835e1523)](https://www.codacy.com/app/LBRY/lbry-desktop?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lbryio/lbry-desktop&amp;utm_campaign=Badge_Grade)
[![chat on Discord](https://img.shields.io/discord/362322208485277697.svg?logo=discord)](https://chat.lbry.io)

[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.io) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with an UI using
[Electron](http://electron.atom.io/).

![App GIF](https://spee.ch/7/lbry-redesign-preview.gif)

## Install

We provide installers for Windows, macOS (v10.9 or greater), and Debian-based Linux. See community maintained builds section for alternative Linux installations.

|                       | Windows                                      | macOS                                        | Linux                                        
| --------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| Latest Stable Release | [Download](https://lbry.io/get/lbry.exe)     | [Download](https://lbry.io/get/lbry.dmg)     | [Download](https://lbry.io/get/lbry.deb)
| Latest Pre-release    | [Download](https://lbry.io/get/lbry.pre.exe) | [Download](https://lbry.io/get/lbry.pre.dmg) | [Download](https://lbry.io/get/lbry.pre.deb)

Our [releases page](https://github.com/lbryio/lbry-desktop/releases) also contains the latest
release, pre-releases, and past builds.   
*Note: If the deb fails to install using the Ubuntu Software Center, install manually via `sudo dpkg -i <path to deb>`. You'll need to run `sudo apt-get install -f` if this is the first time installing it to install dependencies*

To install from source or make changes to the application, continue to the next section below.   

**Community maintained** builds for Arch Linux and Flatpak are available, see below. These installs will need to be updated manually as the in-app update process only supports deb installs at this time.
*Note: If coming from a deb install, the directory structure is different and you'll need to [migrate data](https://lbry.io/faq/backup-data).*

|                       | Flatpak                                   | Arch  | Raspberry Pi       |                                                                                                                              
| --------------------- | ------------------------------------------|------------------| --------------------------------------------
| Latest Release        | [FlatHub Page](https://flathub.org/apps/details/io.lbry.lbry-app)   | [AUR Package](https://aur.archlinux.org/packages/lbry-app-bin/)  | [Pi Installer](https://lbrypi.com)  | 
| Maintainers           | [@choofee](https://github.com/choffee)/[@iuyte](https://github.com/iuyte)    | [@kcseb](https://github.com/kcseb)/[@TimurKiyivinski](https://github.com/TimurKiyivinski) |[@Madiator2011](https://github.com/kodxana)

## Usage
Double click the installed application to browse with the LBRY network.

## Running from Source

#### Prerequisites

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/) (Use Node v8 if having trouble with keytar)
* [Yarn](https://yarnpkg.com/en/docs/install)
* [C++ Build Tools](https://github.com/felixrieseberg/windows-build-tools) (Windows only, only install if having trouble with keytar)

#### Steps

1. Clone (or [fork](https://help.github.com/articles/fork-a-repo/)) this repository: `git clone https://github.com/lbryio/lbry-desktop`
2. Change directories into the downloaded folder: `cd lbry-desktop`
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
