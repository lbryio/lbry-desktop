const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');

const electronConfig = {
  target: 'web',
  entry: {
    // renderer: './src/renderer/index.js',
  },
  output: {
    filename: '[name]/[name].js',
    path: __dirname + '/dist/web',
  },
  module: {
    rules: [],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${STATIC_ROOT}/`,
        to: `${DIST_ROOT}/static/`,
        ignore: 'index.html',
      },
      {
        from: `${STATIC_ROOT}/index.html`,
        to: `${DIST_ROOT}/index.html`,
      },
    ]),
  ],
};

module.exports = merge(baseConfig, electronConfig);
