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

## Development on Linux and macOS

### One-time Setup

1. Clone this repo
2. `DEPS=true ./build.sh`

This will download and install the LBRY app and its dependencies, including [the LBRY daemon](https://github.com/lbryio/lbry) and command line utilities like `node` and `yarn`. \
The LBRY app requires Node >= 6; if you have an earlier version of Node installed and want to keep it, you can use [nvm](https://github.com/creationix/nvm) to switch back and forth.

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

## Development on Windows

### Windows Dependency
1. Download and install `git` from <a href="https://git-for-windows.github.io/">github.io<a> (configure to use command prompt integration)
2. Download and install `npm` and `node` from <a href="https://nodejs.org/en/download/current/">nodejs.org<a>
3. Download and install `python 2.7` from <a href="https://www.python.org/downloads/windows/">python.org</a>
4. Download and Install `Microsoft Visual C++ Compiler for Python 2.7` from <a href="https://www.microsoft.com/en-us/download/confirmation.aspx?id=44266">Microsoft<a>
5. Download and install `.NET Framework 2.0 Software Development Kit (SDK) (x64)` from <a href="https://www.microsoft.com/en-gb/download/details.aspx?id=15354">Microsoft<a> (may need to extract setup.exe and install manually by running install.exe as Administrator)

### One-time Setup
1. Open command prompt as adminstrator and run the following:
```
npm install --global --production windows-build-tools
exit
```

2. Open command prompt in the root of the project and run the following:
```
python -m pip install -r build\requirements.txt
python build\set_version.py
npm install -g yarn
yarn install
```
3. Change directory to `app` and run the following;
```
yarn install
node_modules\.bin\electron-rebuild
node_modules\.bin\electron-rebuild
cd ..
```
4. Change directory to `ui` and run the following:
```
yarn install
npm rebuild node-sass
node node_modules\node-sass\bin\node-sass --output dist\css --sourcemap=none scss\
node_modules\.bin\webpack --config webpack.dev.config.js
xcopy /E dist ..\app\dist
cd ..
```
4. Download the lbry daemon and cli [binaries](https://github.com/lbryio/lbry/releases) and place them in `app\dist\`

### Building lbry-app
1. run `node_modules\.bin\build -p never` from the root of the project.

### Running the electron app
1. Run `node_modules\.bin\electron app`

### Ongoing Development
1. `cd ui`
2. `watch.bat`

This will set up a monitor that will automatically compile any changes to JS or CSS folders inside of the `ui` folder. This allows you to make changes and see them immediately by reloading the app.

## Internationalization

If you want to help translating the lbry-app, you can copy the en.json file in /app/locales and modify the values while leaving the keys as their original English strings. An example for this would be: `"Skip": "Überspringen",` Translations should automatically show up in options.
