const { WEBPACK_WEB_PORT } = require('./config.js');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_PLATFORM_ROOT = path.resolve(__dirname, 'src/platforms/web/');

const webConfig = {
  target: 'web',
  entry: {
    ui: './src/ui/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/web',
    publicPath: '/',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?$|s?css$)/,
        use: [
          {
            loader: 'preprocess-loader',
            options: {
              TARGET: 'web',
              ppOptions: {
                type: 'js',
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src/platforms/')],

    alias: {
      electron: path.resolve(__dirname, 'src/platforms/web/stubs'),
      fs: path.resolve(__dirname, 'src/platforms/web/fs'),
    },
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/index-web.html`,
        to: `${DIST_ROOT}/web/index.html`,
      },
      {
        from: `${STATIC_ROOT}/img/favicon.ico`,
        to: `${DIST_ROOT}/web/favicon.ico`,
      },
      {
        from: `${STATIC_ROOT}/img/og.png`,
        to: `${DIST_ROOT}/web/og.png`,
      },
      {
        from: `${WEB_PLATFORM_ROOT}/server.js`,
        to: `${DIST_ROOT}/web/server.js`,
      },
    ]),
    new DefinePlugin({
      IS_WEB: JSON.stringify(true),
    }),
    new ProvidePlugin({
      __: ['i18n.js', '__'],
    }),
  ],
};

module.exports = merge(baseConfig, webConfig);
