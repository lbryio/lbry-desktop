const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

const electronConfig = {
  target: 'electron-renderer',
  entry: {
    main: './src/platforms/electron/index.js',
    ui: './src/ui/index.js',
  },
  output: {
    filename: '[name]/bundle.js',
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
  resolve: {
    alias: {
      // 'src/electron': path.resolve(__dirname, 'src/platforms/electron');
    }
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
};

module.exports = merge(baseConfig, electronConfig);
