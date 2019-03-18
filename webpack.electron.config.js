const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

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
        ignore: ['font/**/*'],
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
    },
  });
} else {
  const nodeExternals = require('webpack-node-externals');
  // Apply dev overrides
  mainConfig = merge(mainConfig, {
    externals: {
      keytar: 'require("keytar")',
      electron: 'require("electron")',
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
    new DefinePlugin({
      IS_WEB: JSON.stringify(false),
    }),
  ],
};

module.exports = [merge(baseConfig, mainConfig), merge(baseConfig, renderConfig)];
