# LBRY App

[![Build Status](https://travis-ci.org/lbryio/lbry-app.svg?branch=master)](https://travis-ci.org/lbryio/lbry-app)
[![dependencies](https://david-dm.org/lbryio/lbry-app/status.svg)](https://david-dm.org/lbryio/lbry-app)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/78b627d4f5524792adc48719835e1523)](https://www.codacy.com/app/LBRY/lbry-app?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lbryio/lbry-app&amp;utm_campaign=Badge_Grade)
[![chat on Discord](https://img.shields.io/discord/362322208485277697.svg?logo=discord)](https://discord.gg/U5aRyN6)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.io) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with an UI using
[Electron](http://electron.atom.io/).

![App screenshot](https://lbry.io/img/lbry-ui.png)

## Installing

We provide installers for Windows, macOS, and Debian-based Linux.

|                       | Windows                                      | macOS                                        | Linux                                        |
| --------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| Latest Stable Release | [Download](https://lbry.io/get/lbry.exe)     | [Download](https://lbry.io/get/lbry.dmg)     | [Download](https://lbry.io/get/lbry.deb)     |
| Latest Prerelease     | [Download](https://lbry.io/get/lbry.pre.exe) | [Download](https://lbry.io/get/lbry.pre.dmg) | [Download](https://lbry.io/get/lbry.pre.deb) |

Our [releases page](https://github.com/lbryio/lbry-app/releases/latest) also contains the latest
release, pre-releases, and past builds.

To install from source or make changes to the application, continue reading below.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for
development and testing purposes.

### Prerequisites

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/en/docs/install)

### One-time Setup

1. Clone this repository
2. Run `$ yarn`

### Running

The app can be run from the sources using the following command:

`$ yarn dev`

### Build

Run `$ yarn build`.

We use [electron-builder](https://github.com/electron-userland/electron-builder) to create
distributable packages.

## Contributing

Please read [our contributing manual](CONTRIBUTING.md) for details on how to develop for the
project and the process of submitting pull requests.

## Internationalization

If you want to help to translate the lbry-app, you can copy the `en.json` file in `/dist/locales/`
and modify the values while leaving the keys as their original English strings. An example for this
would be: `"Skip": "Überspringen",` Translations should automatically show up in options.

## License

[MIT © LBRY](LICENSE)
