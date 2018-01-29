# LBRY App

[![dependencies](https://david-dm.org/lbryio/lbry-app/status.svg)](https://david-dm.org/lbryio/lbry-app)

The LBRY app is a graphical browser for the decentralized content marketplace provided by the
[LBRY](https://lbry.io) protocol. It is essentially the
[lbry daemon](https://github.com/lbryio/lbry) bundled with a UI using
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

1. Clone this repo
2. `DEPS=true ./build.sh`

This will download and install the LBRY app and its dependencies, including
[the LBRY daemon](https://github.com/lbryio/lbry) and command line utilities like `node` and `yarn`.
The LBRY app requires Node >= 6; if you have an earlier version of Node installed and want to keep
it, you can use [nvm](https://github.com/creationix/nvm) to switch back and forth.

#### Arch Linux and Other Non-Debian Distributions

Running the build script with `DEPS=true` triggers a bash script with `apt-get` specific commands.
If you are using a distribution without `apt-get`, try running the script as:

`./build.sh`

You may also have to install the package [libsecret](https://wiki.gnome.org/Projects/Libsecret) if
it is not already installed.

### Running

The app can be run from the sources using the following command:

`yarn dev`

### On Windows

#### One-time Setup

Download the lbry daemon and CLI [binaries](https://github.com/lbryio/lbry/releases) and place them
in `static\daemon`.

### Build

Run `yarn build`.

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
