const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  dist: path.join(__dirname, 'dist')
};

module.exports = {
  entry: "./js/main.js",
  output: {
    path: path.join(PATHS.dist, 'js'),
    filename: "bundle.js"
  },
  devtool: 'source-map',
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
	// Enable caching for improved performance during development
	// It uses default OS directory by default. If you need
	// something more custom, pass a path to it.
	// I.e., babel?cacheDirectory=<path>
	loader: 'babel?cacheDirectory'
      }
    ]
  }
};
