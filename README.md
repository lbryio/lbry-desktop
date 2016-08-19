# LBRY Web User Interface

This is the frontend for LBRY's in-browser application, that is automatically installed when a user installs [LBRY](https://github.com/lbryio/lbry).

## Development Setup

These steps will get you to change-reload-see:

- Install [LBRY](https://github.com/lbryio/lbry/releases)
- Install node and npm ([this gist may be useful](https://gist.github.com/isaacs/579814))
- Run `./watch.sh` (this will `npm install` dependencies)
- Run `lbrynet-daemon --ui=/full/path/to/dist/`
- Changes made in `js` and `sass` will be auto compiled to `dist`
- `lbrynet-daemon --branch=branchname` can be used to test remote branches
- `lbry.call('configure_ui', {path: '/path/to/ui'})` can be used in JS console on web ui to switch ui path
- Occasionally refreshing the cache may be necessary for changes to show up in browser

## Common Issues
1. Error: Couldn't find preset "es2015" relative to directory "js"

Fix with:

    npm install babel-preset-es2015 --save
    npm install babel-preset-react --save
