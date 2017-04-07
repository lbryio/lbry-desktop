const path = require('path');
const appPath = path.resolve(__dirname, 'js');

const PATHS = {
  app: path.join(__dirname, 'app'),
  dist: path.join(__dirname, '..', 'app', 'dist')
};

module.exports = {
  entry: ['babel-polyfill', './js/main.js'],
  output: {
    path: path.join(PATHS.dist, 'js'),
    publicPath: '/js/',
    filename: "bundle.js",
    pathinfo: true
  },
  debug: true,
  cache: true,
  devtool: 'eval',
  resolve: {
    root: appPath,
    extensions: ['', '.js', '.jsx', '.css'],
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        // define an include so we check just the files we need
        include: PATHS.app
      }
    ],
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets:[ 'es2015', 'react', 'stage-2' ]
        }
      }
    ]
  },
  target: 'electron-main',
};
