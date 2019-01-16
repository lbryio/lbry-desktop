const path = require('path');
const FilewatcherPlugin = require('filewatcher-webpack-plugin');

const ELECTRON_RENDERER_PROCESS_ROOT = path.resolve(__dirname, 'src/renderer/');

let PROCESS_ARGV = process.env.npm_config_argv;
if (PROCESS_ARGV) {
  PROCESS_ARGV = JSON.parse(PROCESS_ARGV);
}

const isDev = PROCESS_ARGV && PROCESS_ARGV.original && PROCESS_ARGV.original.indexOf('dev') !== -1;

let plugins = [];
if (isDev) {
  plugins.push(
    new FilewatcherPlugin({
      watchFileRegex: [require.resolve('lbry-redux'), require.resolve('lbryinc')],
    })
  );
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  // This allows imports to be made from the renderer process root (https://moduscreate.com/blog/es6-es2015-import-no-relative-path-webpack/).
  resolve: {
    modules: [ELECTRON_RENDERER_PROCESS_ROOT, 'node_modules', __dirname],
    extensions: ['.js', '.jsx', '.scss'],
  },
  plugins,
};
