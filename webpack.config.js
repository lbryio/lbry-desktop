const path = require('path');

const ELECTRON_RENDERER_PROCESS_ROOT = path.resolve(__dirname, 'src/renderer/');

module.exports = env => {
  return {
    mode: 'development',
    entry: './src/web/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/web'),
      filename: 'bundle.js',
      publicPath: '/static/main/app/'
    },
    optimization: {
      minimize: false
    },
    target: "web",
    node: {
      fs: "empty",
      // electron: "empty",
      "electron-is-dev": "mock",
      store: "mock",
      y18n: "mock",
      tls: "mock",
      net: "mock"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['env', 'react', 'stage-2'],
              },    
            },
            {
              loader: 'preprocess-loader',
              options: {
                TARGET: 'web',
                ppOptions: {
                  type: 'js'
                }
              },
            },
          ],
          exclude: /node_modules/,
        },
        // {
        //   test: /\.jsx?$/,
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['env', 'react', 'stage-2'],
        //   },
        //   exclude: /node_modules/,
        // },
        {
          test: /\.scss$/,
          use: [
              "style-loader", // creates style nodes from JS strings
              "css-loader", // translates CSS into CommonJS
              "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
          // loader: 'url-loader?limit=100000'
          use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                // outputPath: 'resources/'
            }
          }]
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader']
        },
      ],
    },
    resolve: {
      modules: [ELECTRON_RENDERER_PROCESS_ROOT, 'node_modules', __dirname],
      extensions: ['.js', '.jsx', '.scss', '.json'],
    },
    externals: [
      (function () {
        var IGNORES = [
          'electron',
          'breakdance',
          'i18n'
          // 'electron-is-dev',
          // 'store',
          // 'y18n',
          // 'tls',
          // 'net'
        ];
        return function (context, request, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            // return callback(null, "require('" + request + "')");
            return callback(null, "{}");
          }
          return callback();
        };
      })()
    ]
  };
};