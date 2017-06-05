const path = require("path");
const webpack = require("webpack")
const WebpackNotifierPlugin = require("webpack-notifier")

const appPath = path.resolve(__dirname, "js");

const PATHS = {
  app: path.join(__dirname, "app"),
  dist: path.join(__dirname, "..", "app", "dist")
};

module.exports = {
  entry: ["babel-polyfill", "./js/main.js"],
  output: {
    path: path.join(PATHS.dist, "js"),
    publicPath: "/js/",
    filename: "bundle.js",
    pathinfo: true
  },
  cache: true,
  devtool: "eval",
  resolve: {
    modules: [appPath, "node_modules"],
    extensions: [".js", ".jsx", ".css"]
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify("development"),
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: "pre",
        loaders: ["eslint"],
        // define an include so we check just the files we need
        include: PATHS.app
      },
      {
        test: /\.node$/,
        use: ["node-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [ "es2015", "react", "stage-2" ]
          }
        }
      }
    ]
  },
  target: "electron-main",
};
