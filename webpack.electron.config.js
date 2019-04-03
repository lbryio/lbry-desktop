const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const NODE_ENV = process.env.NODE_ENV || 'development';

const { ifProduction } = getIfUtils(NODE_ENV);

let mainConfig = {
  target: 'electron-main',
  entry: {
    main: './src/platforms/electron/index.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/electron/webpack',
  },
  module: {
    rules: [
      {
        test: /\.(jsx?$|s?css$)/,
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
        ignore: ['font/**/*', 'index.dev.html', 'index.html'],
      },
      {
        from: ifProduction(`${STATIC_ROOT}/index.html`, `${STATIC_ROOT}/index.dev.html`),
        to: `${DIST_ROOT}/electron/static/index.html`,
      },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist/electron'),
  },
};

if (process.env.NODE_ENV === 'production') {
  // Apply prod overrides
  mainConfig = merge(mainConfig, {
    externals: {
      keytar: 'require("keytar")',
      electron: 'require("electron")',
      express: 'require("express")',
      'electron-updater': 'require("electron-updater")',
    },
  });
} else {
  const nodeExternals = require('webpack-node-externals');
  // Apply dev overrides
  mainConfig = merge(mainConfig, {
    externals: {
      keytar: 'require("keytar")',
      electron: 'require("electron")',
      express: 'require("express")',
      'electron-updater': 'require("electron-updater")',
    },
  });
}

const renderConfig = {
  target: 'electron-renderer',
  entry: {
    ui: ['./src/ui/index.jsx'],
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
  plugins: [
    // new BundleAnalyzerPlugin(),
    new DefinePlugin({
      IS_WEB: JSON.stringify(false),
    }),
  ],
};

module.exports = [merge(baseConfig, mainConfig), merge(baseConfig, renderConfig)];
