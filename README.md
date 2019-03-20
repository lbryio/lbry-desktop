# LBRY App

[![MIT licensed](https://img.shields.io/dub/l/vibe-d.svg?style=flat)](https://github.com/lbryio/lbry-desktop/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/lbryio/lbry-desktop.svg)](https://GitHub.com/lbryio/lbry-desktop/releases/)
[![Build Status](https://travis-ci.org/lbryio/lbry-desktop.svg?branch=master)](https://travis-ci.org/lbryio/lbry-desktop)
[![Dependencies](https://david-dm.org/lbryio/lbry-desktop/status.svg)](https://david-dm.org/lbryio/lbry-desktop)
[![chat on Discord](https://img.shields.io/discord/362322208485277697.svg?logo=discord)](https://chat.lbry.com)

[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.com) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with a UI using
[Electron](https://electron.atom.io/).

![App GIF](https://spee.ch/@lbry:3f/darwin-029.gif)

## Install

We provide installers for Windows, macOS (v10.12.4, Sierra, or greater), and Debian-based Linux. See community maintained builds section for alternative Linux installations.

|                       | Windows                                       | macOS                                         | Linux                                         |
| --------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Latest Stable Release | [Download](https://lbry.com/get/lbry.exe)     | [Download](https://lbry.com/get/lbry.dmg)     | [Download](https://lbry.com/get/lbry.deb)     |
| Latest Pre-release    | [Download](https://lbry.com/get/lbry.pre.exe) | [Download](https://lbry.com/get/lbry.pre.dmg) | [Download](https://lbry.com/get/lbry.pre.deb) |

Our [releases page](https://github.com/lbryio/lbry-desktop/releases) also contains the latest
release, pre-releases, and past builds.  
_Note: If the deb fails to install using the Ubuntu Software Center, install manually via `sudo dpkg -i <path to deb>`. You'll need to run `sudo apt-get install -f` if this is the first time installing it to install dependencies_

To install from source or make changes to the application, continue to the next section below.

**Community maintained** builds for Arch Linux and Flatpak are available, see below. These installs will need to be updated manually as the in-app update process only supports Debian installs at this time.
_Note: If coming from a deb install, the directory structure is different and you'll need to [migrate data](https://lbry.com/faq/backup-data)._

|                | Flatpak                                                                   | Arch                                                                                      | Raspberry Pi                                |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| Latest Release | [FlatHub Page](https://flathub.org/apps/details/io.lbry.lbry-app)         | [AUR Package](https://aur.archlinux.org/packages/lbry-app-bin/)                           | [Pi Installer](https://lbrypi.com)          |
| Maintainers    | [@choofee](https://github.com/choffee)/[@iuyte](https://github.com/iuyte) | [@kcseb](https://github.com/kcseb)/[@TimurKiyivinski](https://github.com/TimurKiyivinski) | [@Madiator2011](https://github.com/kodxana) |

## Usage

Double click the installed application to interact with the LBRY network.

## Running from Source

#### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (v10 required)
- [Yarn](https://yarnpkg.com/en/docs/install)

#### Steps

1.  Clone (or [fork](https://help.github.com/articles/fork-a-repo/)) this repository: `git clone https://github.com/lbryio/lbry-desktop`
2.  Change directories into the downloaded folder: `cd lbry-desktop`
3.  Install the dependencies: `yarn`
4.  Compile the app and run it: `yarn dev`

If you want to just build the app you can run `yarn build`. This will give you an executable inside the `/dist` folder. We use [electron-builder](https://github.com/electron-userland/electron-builder) to create
distributable packages.

#### Resetting your Packages

If the app isn't building, or `yarn xxx` commands aren't working you may need to just reset your `node_modules`. To do so you can run: `rm -r node_modules && yarn` or `del /s /q node_modules && yarn` on Windows.

If you _really_ think something might have gone wrong, you can force your repo to clear everything that doesn't match the repo with `git reset --hard HEAD && git clean -fxd && git pull -r`

## Contributing

We :heart: contributions from everyone and contributions to this project are encouraged, and compensated. We welcome [bug reports](https://github.com/lbryio/lbry-desktop/issues/), [bug fixes](https://github.com/lbryio/lbry-desktop/pulls) and feedback is always appreciated. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lbryio/lbry-desktop/issues) [![GitHub contributors](https://img.shields.io/github/contributors/lbryio/lbry-desktop.svg)](https://GitHub.com/lbryio/lbry-desktop/graphs/contributors/)

## License

This project is MIT licensed. For the full license, see [LICENSE](LICENSE).

## Security

We take security seriously. Please contact security@lbry.com regarding any security issues. Our PGP key is [here](https://keybase.io/lbry/key.asc) if you need it.

## Contact

The primary contact for this project is [@seanyesmunt](https://github.com/seanyesmunt).
