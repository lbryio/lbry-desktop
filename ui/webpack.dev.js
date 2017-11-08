const path = require("path");
const webpack = require("webpack")
const WebpackNotifierPlugin = require("webpack-notifier")
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
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
    })
  ]
});