const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

const webConfig = {
  target: 'web',
  entry: {
    ui: './src/ui/index.js',
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist/web',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
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
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/`,
        to: `${DIST_ROOT}/web/static/`,
        ignore: ['font/**/*', 'index.html'],
      },
      {
        from: `${STATIC_ROOT}/index.html`,
        to: `${DIST_ROOT}/web/index.html`,
      },
    ]),
  ],
};

module.exports = merge(baseConfig, webConfig);
