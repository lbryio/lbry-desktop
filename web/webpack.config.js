const { WEBPACK_WEB_PORT, LBRY_WEB_API } = require('../config.js');
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { insertToHead, buildBasicOgMetadata } = require('./src/html');

const CUSTOM_ROOT = path.resolve(__dirname, '../custom/');
const STATIC_ROOT = path.resolve(__dirname, '../static/');
const UI_ROOT = path.resolve(__dirname, '../ui/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_PLATFORM_ROOT = __dirname;
const isProduction = process.env.NODE_ENV === 'production';
const hasSentryToken = process.env.SENTRY_AUTH_TOKEN !== undefined;

const copyWebpackCommands = [
  {
    from: `${STATIC_ROOT}/index-web.html`,
    to: `${DIST_ROOT}/index.html`,
    transform(content, path) {
      return insertToHead(content.toString(), buildBasicOgMetadata());
    },
  },
  {
    from: `${STATIC_ROOT}/img/favicon.png`,
    to: `${DIST_ROOT}/public/favicon.png`,
  },
  {
    from: `${STATIC_ROOT}/img/v2-og.png`,
    to: `${DIST_ROOT}/public/v2-og.png`,
  },
  {
    from: `${STATIC_ROOT}/font/`,
    to: `${DIST_ROOT}/public/font/`,
  },
];

const CUSTOM_OG_PATH = `${CUSTOM_ROOT}/v2-og.png`;
if (fs.existsSync(CUSTOM_OG_PATH)) {
  copyWebpackCommands.push({
    from: CUSTOM_OG_PATH,
    to: `${DIST_ROOT}/public/v2-og.png`,
  });
}

let plugins = [
  new CopyWebpackPlugin(copyWebpackCommands),
  new DefinePlugin({
    IS_WEB: JSON.stringify(true),
    'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL || LBRY_WEB_API),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
];

if (isProduction && hasSentryToken) {
  plugins.push(
    new SentryWebpackPlugin({
      include: './dist',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: 'sentry.properties',
    })
  );
}

const webConfig = {
  target: 'web',
  entry: {
    ui: '../ui/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/public/'),
    publicPath: '/public/',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
    contentBase: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        options: {
          presets: ['@babel/env', '@babel/react', '@babel/flow'],
          plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties'],
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
      lbryinc: 'lbryinc/dist/bundle.es.js',
      electron: `${WEB_PLATFORM_ROOT}/stubs/electron.js`,
      fs: `${WEB_PLATFORM_ROOT}/stubs/fs.js`,
    },
  },
  plugins,
};

module.exports = merge(baseConfig, webConfig);
