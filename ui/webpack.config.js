const path = require("path");
const webpack = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const appPath = path.resolve(__dirname, "js");

process.traceDeprecation = true;

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
   new ExtractTextPlugin(path.join("../css/bundle.css"), { allChunks: true }),
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
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: "name]__[local]___[hash:base64:5]"
            }
          }
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: {
            loader: "css-loader",
            query: {
              modules: true,
              localIdentName: "[local]"
            }
          }
        })
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
