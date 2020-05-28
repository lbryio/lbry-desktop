# lbry-redux

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

lbry-redux is a module which contains common React and redux code shared between lbry-desktop and lbry-android.

## Installation
Add `lbry-redux` as a dependency to your `package.json` file.
`"lbry-redux": "lbryio/lbry-redux"`

### Local development
If you intend to make changes to the module and test immediately, you can use `npm link` to add the package to your `node_modules` folder. This will create a symlink to the folder where `lbry-redux` was cloned to.
```
cd lbry-redux
yarn link
cd /<path>/<to>/<project> (ex: cd ~/lbry-desktop)
yarn link lbry-redux
````

### Build
Run `$ yarn build`. If the symlink does not work, just build the file and move the `bundle.js` file into the `node_modules/` folder.

## Contributing 
We :heart: contributions from everyone! We welcome [bug reports](https://github.com/lbryio/lbry-redux/issues/), [bug fixes](https://github.com/lbryio/lbry-redux/pulls) and feedback on the module is always appreciated.

## [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/lbryio/lbry-redux/issues) [![GitHub contributors](https://img.shields.io/github/contributors/lbryio/lbry-redux.svg)](https://GitHub.com/lbryio/lbry-redux/graphs/contributors/)

## License

This module is released under the [MIT License](LICENSE)
