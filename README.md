# LBRY Web User Interface

This is the frontend for LBRY's in-browser application, that is automatically installed when a user installs [LBRY](https://github.com/lbryio/lbry).

## Development Setup

These steps will get you to change-reload-see:

- Install [LBRY](https://github.com/lbryio/lbry/releases)
- Install node and npm ([this gist may be useful](https://gist.github.com/isaacs/579814))
- Install babel (`npm install -g babel-cli babel-preset-es2015 babel-preset-react`)
- Install [SASS](http://sass-lang.com/install)
- Run ./watch.sh
- Run lbrynet-daemon --ui=/full/path/to/dist/
- Changes made in `js` and `sass` will be auto compiled to `dist`
- `lbrynet-daemon --branch=branchname` can be used to test remote branches
- `lbry.call('configure_ui', {path: '/path/to/ui'})` can be used in JS console on web ui to switch ui path
- Occasionally refreshing the cache may be necessary for changes to show up in browser
