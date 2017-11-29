const path = require("path");
const webpack = require("webpack")
const WebpackNotifierPlugin = require("webpack-notifier")
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const FlowBabelWebpackPlugin = require('./flowtype-plugin');


const PATHS = {
  dist: path.join(__dirname, "..", "main", "dist")
};

module.exports = merge(common, {
  output: {
    path: path.join(PATHS.dist, "js"),
    pathinfo: true
  },
  cache: true,
  devtool: "eval",
  plugins: [
    new WebpackNotifierPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify("development"),
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new FlowBabelWebpackPlugin({
      warn: true
    })
  ]
});
