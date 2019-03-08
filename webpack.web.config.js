const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
      electron: path.resolve(__dirname, 'src/platforms/web/electron'),
    },
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/index.html`,
        to: `${DIST_ROOT}/web/index.html`,
      },
      {
        from: `${STATIC_ROOT}/img/favicon.ico`,
        to: `${DIST_ROOT}/web/favicon.ico`,
      },
      {
        from: `${WEB_PLATFORM_ROOT}/server.js`,
        to: `${DIST_ROOT}/web/server.js`,
      },
    ]),
  ],
};

module.exports = merge(baseConfig, webConfig);
