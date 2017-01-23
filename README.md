# LBRY Web User Interface

This is the web-based frontend for the LBRY network. It is automatically installed when a user installs [LBRY](https://github.com/lbryio/lbry).

## Development Setup

- Install [LBRY](https://github.com/lbryio/lbry/releases)
- Install node and npm (if you can, [use this](https://github.com/nodesource/distributions). if not, [this gist may be useful](https://gist.github.com/isaacs/579814))
- Checkout this project via git
- Run `./watch.sh` (this will `npm install` dependencies)
- Run LBRY

While `watch.sh` is running, any change made to the `js` or `scss` folders will automatically be compiled into the `dist` folder.

While changes will automatically compile, they will not automatically be loaded by the app. Every time a file changes, you must run:

`lbrynet-cli configure_ui path=/path/to/repo/dist`

Then reload the page. This call can also be made directly via the browser Javascript console:

`lbry.call('configure_ui', {path: '/path/to/ui'})`

To reset your UI to the version packaged with the application, run:

`lbrynet-cli configure_ui branch=master`

This command also works to test non-released branches of `lbry-web-ui`

