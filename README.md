<img width="40%" src="https://miro.medium.com/max/5198/1*bTVuL2THG_0mpwmE-n7Ezg.png" />

# LBRY Desktop

A desktop app for browsing and publishing on the [LBRY](https://lbry.org) network. It's the
[LBRY daemon](https://github.com/lbryio/lbry-sdk) with a user interface, built with
[Electron](https://www.electronjs.org/).

This is [Bitcoin Brisbane](https://github.com/bitcoinbrisbane)'s fork of
[lbryio/lbry-desktop](https://github.com/lbryio/lbry-desktop), which has had no changes merged since
April 2023. We follow the [LBRY Foundation's fork](https://github.com/LBRYFoundation/lbry-desktop)
and send our changes there as well.

<a href="LICENSE" title="MIT licensed"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>

![App GIF](https://spee.ch/ba/lbry-joule.gif)

## Contents

1. [What's different in this fork](#whats-different-in-this-fork)
2. [Install](#install)
3. [Running from source](#running-from-source)
4. [Contributing](#contributing)
5. [Security](#security)
6. [License](#license)
7. [Contact](#contact)

## What's different in this fork

- The LBRY Foundation's 2025 build and CI fixes are merged in.
- Open issues from the original tracker are copied here with the
  [`from-lbryio`](https://github.com/bitcoinbrisbane/lbry-desktop/issues?q=label%3Afrom-lbryio) label,
  so they can be worked on.
- In progress: a setting to search with [lbry-search](https://github.com/bitcoinbrisbane/lbry-search),
  a self-hosted search index that follows an LBRY full node, instead of Lighthouse
  ([#1](https://github.com/bitcoinbrisbane/lbry-desktop/pull/1)).

## Install

This fork doesn't publish builds yet. The last official release, v0.53.9 (February 2023), is on the
[lbryio releases page](https://github.com/lbryio/lbry-desktop/releases) and at
[lbry.com/get](https://lbry.com/get), for Windows, macOS and Debian-based Linux.

_If the deb fails to install from the Ubuntu Software Center, install it with `sudo dpkg -i <path to deb>`,
then run `sudo apt-get install -f` to install its dependencies._

Community builds. The app's own updater only updates the deb, so update these yourself:

| Flatpak                                              | Arch                                                              | Nixpkgs                                                                            | ARM/ARM64                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| [Flathub](https://flathub.org/apps/io.lbry.lbry-app) | [AUR package](https://aur.archlinux.org/packages/lbry-desktop-bin) | [Nixpkgs](https://search.nixos.org/packages?channel=unstable&show=lbry&query=lbry) | [Build guide](https://odysee.com/@LBRYarm:5) |

_Coming from a deb install? These keep their data somewhere else, so you'll need to
[move your data](https://lbry.com/faq/backup-data)._

## Running from source

You need [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/en/download/) 20 or newer,
and Yarn through [Corepack](https://nodejs.org/api/corepack.html) (`corepack enable`), which uses the
Yarn version this repo pins.

1. Clone this repository: `git clone https://github.com/bitcoinbrisbane/lbry-desktop`
2. `cd lbry-desktop`
3. Install the dependencies: `yarn`. This also downloads the LBRY daemon into `static/daemon`.
4. Run the app: `yarn dev`

`yarn build` builds the production app into `dist/` with [electron-builder](https://www.electron.build/).

**Linux:** on recent Ubuntu, Electron stops at startup with "The SUID sandbox helper binary was found,
but is not configured correctly". Give its sandbox helper the permissions it asks for, and again after
each `yarn` install:

```sh
sudo chown root:root node_modules/electron/dist/chrome-sandbox
sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
```

#### Resetting your packages

If the app isn't building, or `yarn` commands aren't working, reset your `node_modules`:
`rm -r node_modules && yarn`, or `del /s /q node_modules && yarn` on Windows.

If you _really_ think something has gone wrong, you can clear everything that doesn't match the repo
with `git reset --hard HEAD && git clean -fxd && git pull -r`.

## Contributing

Bug reports, fixes and feedback are welcome: open an
[issue](https://github.com/bitcoinbrisbane/lbry-desktop/issues) or a
[pull request](https://github.com/bitcoinbrisbane/lbry-desktop/pulls). See
[CONTRIBUTING.md](CONTRIBUTING.md) for how.

## Security

Please don't report security problems in public issues. Report them privately through this
repository's [Security tab](https://github.com/bitcoinbrisbane/lbry-desktop/security/advisories/new).
See [SECURITY.md](SECURITY.md) for what to include and what's in scope.

## License

MIT. See [LICENSE](LICENSE).

## Contact

This fork is maintained by [Bitcoin Brisbane](https://github.com/bitcoinbrisbane). For anything else,
open an [issue](https://github.com/bitcoinbrisbane/lbry-desktop/issues).
