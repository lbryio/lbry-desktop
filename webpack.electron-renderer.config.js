const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const NODE_ENV = process.env.NODE_ENV || 'development';
const { ifProduction } = getIfUtils(NODE_ENV);

let plugins = [
  new DefinePlugin({
    IS_WEB: JSON.stringify(false),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
];

const renderConfig = {
  target: 'electron-renderer',
  entry: {
    ui: ['./ui/index.jsx'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/electron/webpack',
  },
  module: {
    rules: [
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
  plugins,
};

module.exports = merge(baseConfig, renderConfig);
