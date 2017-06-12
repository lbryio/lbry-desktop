# LBRY App

This is a graphical browser for the decentralized content marketplace provided by the [LBRY](https://lbry.io) protocol. It is essentially the [lbry daemon](https://github.com/lbryio/lbry) bundled with a UI using [Electron](http://electron.atom.io/).

![App Screenshot](https://lbry.io/img/lbry-ui.png)

## Installing

We provide installers for Windows, macOS, and Debian-based Linux.

| | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Latest Stable Release | [Download](https://lbry.io/get/lbry.exe) | [Download](https://lbry.io/get/lbry.dmg) | [Download](https://lbry.io/get/lbry.deb) |
| Latest Prerelease | [Download](https://lbry.io/get/lbry.pre.exe) | [Download](https://lbry.io/get/lbry.pre.dmg) | [Download](https://lbry.io/get/lbry.pre.deb) |


Our [releases page](https://github.com/lbryio/lbry-app/releases/latest) also contains the latest release, pre-releases, and past builds.

To install from source or make changes to the application, continue reading below.

## Development

### One-time Setup

1. Install node and npm.
2. Check out this repo.
3. Set up a Python virtual environment, or live on the wild side.
4. Run `./build.sh`. This builds the UI assets and puts them into `app/dist`. It also downloads [lbry daemon](https://github.com/lbryio/lbry/releases).

### Running

Run `./node_modules/.bin/electron app`

### Ongoing Development
1. `cd ui`
2. `./watch.sh`

This will set up a monitor that will automatically compile any changes to JS or CSS folders inside of the `ui` folder. This allows you to make changes and see them immediately by reloading the app.

### Packaging

We use [electron-builder](https://github.com/electron-userland/electron-builder)
to create distributable packages, which is run by calling:

`node_modules/.bin/build -p never`

### Development on Windows

This project has currently only been worked on in Linux and macOS. If you are on Windows, you can
checkout out the build steps in [appveyor.yml](https://github.com/lbryio/lbry-app/blob/master/.appveyor.yml) and probably figure out something from there.

## Internationalization

If you want to help translating the lbry-app, you can copy the en.json file in /app/locales and modify the values while leaving the keys as their original English strings. An example for this would be: `"Skip": "Überspringen",` Translations should automatically show up in options.