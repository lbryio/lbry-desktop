const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

const mainConfig = {
  target: 'electron-main',
  entry: {
    main: './src/platforms/electron/index.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/electron',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'preprocess-loader',
            options: {
              TARGET: 'app',
              ppOptions: {
                type: 'js',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/`,
        to: `${DIST_ROOT}/electron/static/`,
        ignore: ['font/**/*', 'index.html'],
      },
      {
        from: `${STATIC_ROOT}/index.html`,
        to: `${DIST_ROOT}/electron/index.html`,
      },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist/electron'),
  },
};

const renderConfig = {
  target: 'electron-renderer',
  entry: {
    ui: ['./src/ui/index.jsx'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/electron',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'preprocess-loader',
            options: {
              TARGET: 'app',
              ppOptions: {
                type: 'js',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/`,
        to: `${DIST_ROOT}/electron/static/`,
        ignore: ['font/**/*', 'index.html', 'index.dev.html'],
      },
      {
        from: `${STATIC_ROOT}/index.html`,
        to: `${DIST_ROOT}/electron/index.html`,
      },
      {
        from: `${STATIC_ROOT}/index.dev.html`,
        to: `${DIST_ROOT}/electron/index.dev.html`,
      },
    ]),
  ],
};

module.exports = [merge(baseConfig, mainConfig), merge(baseConfig, renderConfig)];
