const config = require('./config');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const NODE_ENV = process.env.NODE_ENV || 'development';

const { ifProduction } = getIfUtils(NODE_ENV);

let mainConfig = {
  target: 'electron-main',
  entry: {
    main: './electron/index.js',
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
        ignore: ['index-web.html', 'index-electron.html', 'daemon/**/*', 'lbry-first/**/*'],
      },
      {
        from: `${STATIC_ROOT}/index-electron.html`,
        to: `${DIST_ROOT}/electron/static/index.html`,
      },
      {
        from: `${STATIC_ROOT}/daemon`,
        to: `${DIST_ROOT}/electron/daemon`,
      },
      {
        from: `${STATIC_ROOT}/lbry-first`,
        to: `${DIST_ROOT}/electron/lbry-first`,
      },
    ]),
  ],
};

if (process.env.NODE_ENV === 'production') {
  // Apply prod overrides
  mainConfig = merge(mainConfig, {
    externals: {
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
      electron: 'require("electron")',
      express: 'require("express")',
      'electron-updater': 'require("electron-updater")',
    },
  });
}

let plugins = [
  new DefinePlugin({
    IS_WEB: JSON.stringify(false),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
];

// if (hasSentryToken) {
//   plugins.push(
//     new SentryWebpackPlugin({
//       include: './dist',
//       ignoreFile: '.sentrycliignore',
//       ignore: ['node_modules', 'webpack.config.js', 'webworkers'],
//       configFile: 'sentry.properties',
//     })
//   );
// }

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

module.exports = [merge(baseConfig, mainConfig), merge(baseConfig, renderConfig)];
