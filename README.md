# Odysee Frontend - Odysee.com

This repo contains the UI and front end code that powers Odysee.com.

 <a href="https://github.com/lbryio/lbry-desktop/blob/master/LICENSE" title="MIT licensed">
   <img alt="npm" src="https://img.shields.io/dub/l/vibe-d.svg?style=flat">
 </a>
 <a href="https://chat.odysee.com">
   <img src="https://img.shields.io/discord/362322208485277697.svg?logo=discord" alt="chat on Discord">
 </a>

## Table of Contents

1. [Usage](#usage)
2. [Running from Source](#running-from-source)
3. [Contributing](#contributing)
4. [License](#license)
5. [Security](#security)
6. [Contact](#contact)

## Usage

Go to the website to interact on this frontend.

## Running from Source

You can run the web version (odysee.com), via running onto your host machine, or go to the website itself.

#### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) (v14 required)
- [Yarn](https://yarnpkg.com/en/docs/install)

1. Clone (or [fork](https://help.github.com/articles/fork-a-repo/)) this repository: `git clone https://github.com/OdyseeTeam/odysee-frontend`
2. Change directory into the cloned repository: `cd odysee-frontend`
3. Install the dependencies: `yarn`

#### Run the web app for development

`yarn dev:web`

- This uses webpack-dev-server and includes hot-reloading. If you want to debug the [web server we use in production](https://github.com/OdyseeTeam/odysee-frontend/blob/master/web/index.js) you can run `yarn dev:web-server`. This starts a server at `localhost:1337` and does not include hot reloading.

#### Customize the web app

- In root directory, duplicate the .env.default file and rename it to .env then copy the code below and paste it anywhere in the .env file.

```
cp .env.defaults .env
nano .env
```

- To specify your own OG-IMAGE
  You can either place a png named v2-og.png in the /custom folder or specify the OG_IMAGE_URL in .env

- To specify your own channels to be followed on first run
  `AUTO_FOLLOW_URLS=lbry://@chan#123...a lbry://@chan2#456...a`

- If you want to customize the homepage content

1. add `CUSTOM_HOMEPAGE=true` to the '.env' file
2. copy `/custom/homepage.example.js` to `/custom/homepage.js` and make desired changes to `homepage.js`

- If you want up to two custom sidebar links:

```
PINNED_URI_1=@someurl#2/someclaim#4
PINNED_LABEL_1=Linktext

PINNED_URI_2=$/discover?t=tag&[queryparams]
PINNED_LABEL_2=OtherLinkText
```

- Finally `NODE_ENV=production yarn compile:web` to rebuild
  _Note: You don't need to edit the .env file in the /web folder - that is copied during compile._

#### Deploy the web app (_experimental_)

1. Create a server with a domain name and a reverse proxy https to port 1337.
2. Install pm2, node v10, yarn
3. Clone this repo
4. Make any customizations as above
5. Run `yarn` to install
6. Run `NODE_ENV=production yarn compile:web` to build
7. Set up pm2 to start ./web/index.js

#### Resetting your Packages

If the app isn't building, or `yarn xxx` commands aren't working you may need to just reset your `node_modules`. To do so you can run: `rm -r node_modules && yarn` or `del /s /q node_modules && yarn` on Windows.

If you _really_ think something might have gone wrong, you can force your repo to clear everything that doesn't match the repo with `git reset --hard HEAD && git clean -fxd && git pull -r`

## Contributing

We :heart: contributions from everyone and contributions to this project are encouraged, and compensated. We welcome [bug reports](https://github.com/OdyseeTeam/odysee-frontend/issues/), [bug fixes](https://github.com/OdyseeTeam/odysee-frontend/pulls) and feedback is always appreciated. For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/OdyseeTeam/odysee-frontend/issues) [![GitHub contributors](https://img.shields.io/github/contributors/lbryio/lbry-desktop.svg)](https://GitHub.com/OdyseeTeam/odysee-frontend/graphs/contributors/)

## License

This project is MIT licensed. For the full license, see [LICENSE](LICENSE).

## Security

For security issues, please reach out to security@odysee.com
