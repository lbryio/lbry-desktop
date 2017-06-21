const path = require("path");
const webpack = require("webpack")
const appPath = path.resolve(__dirname, "js");

const PATHS = {
  app: path.join(__dirname, "app"),
  dist: path.join(__dirname, "dist")
};

module.exports = {
  entry: ["babel-polyfill", "./js/main.js"],
  output: {
    path: path.join(PATHS.dist, "js"),
    publicPath: "/js/",
    filename: "bundle.js"
  },
  devtool: "source-map",
  resolve: {
    modules: [appPath, "node_modules"],
    extensions: [".js", ".jsx", ".css"]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify("production"),
    }),
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
