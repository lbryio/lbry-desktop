const { WEBPACK_WEB_PORT, LBRY_TV_API } = require('../config.js');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');

const STATIC_ROOT = path.resolve(__dirname, '../static/');
const UI_ROOT = path.resolve(__dirname, '../ui/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_PLATFORM_ROOT = __dirname;

const webConfig = {
  target: 'web',
  entry: {
    ui: '../ui/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/',
    publicPath: '/',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        options: {
          rootMode: 'upward',
        },
      },
      {
        loader: 'preprocess-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        options: {
          TARGET: 'web',
          ppOptions: {
            type: 'js',
          },
        },
      },
    ],
  },
  resolve: {
    modules: [UI_ROOT, __dirname],

    alias: {
      electron: `${WEB_PLATFORM_ROOT}/stubs/electron.js`,
      fs: `${WEB_PLATFORM_ROOT}/stubs/fs.js`,
    },
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/index-web.html`,
        to: `${DIST_ROOT}/index.html`,
      },
      {
        from: `${STATIC_ROOT}/img/favicon.ico`,
        to: `${DIST_ROOT}/favicon.ico`,
      },
      {
        from: `${STATIC_ROOT}/img/og.png`,
        to: `${DIST_ROOT}/og.png`,
      },
    ]),
    new DefinePlugin({
      IS_WEB: JSON.stringify(true),
      'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL || LBRY_TV_API),
    }),
    new ProvidePlugin({
      __: ['i18n.js', '__'],
    }),
  ],
};

module.exports = merge(baseConfig, webConfig);
