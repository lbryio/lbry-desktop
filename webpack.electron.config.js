const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

const electronConfig = {
  target: 'electron-renderer',
  entry: {
    main: './src/electron/index.js',
    ui: './src/ui/index.js',
  },
  output: {
    filename: '[name]/bundle.js',
    path: __dirname + '/dist/electron',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/`,
        to: `${DIST_ROOT}/electron/static/`,
        ignore: ['font/**/*', 'electron.index.html'],
      },
      {
        from: `${STATIC_ROOT}/electron.index.html`,
        to: `${DIST_ROOT}/electron/index.html`,
      },
    ]),
  ],
};

module.exports = merge(baseConfig, electronConfig);
