const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const RENDERER_PROCESS_ROOT = path.resolve(__dirname, 'src/renderer/');

module.exports = env => {
  return {
    // commented out because of webpack 3
    // mode: 'development',
    entry: './src/renderer/web/index.js',
    output: {
      path: path.resolve(__dirname, 'dist/web'),
      filename: 'bundle.js',
      publicPath: '/static/app/',
    },
    target: 'web',
    node: {
      fs: 'empty',
      // electron: "empty",
      'electron-is-dev': 'mock',
      store: 'mock',
      y18n: 'mock',
      tls: 'mock',
      net: 'mock',
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
                LBRYNET_PROXY_URL: '/api_proxy/',
                ppOptions: {
                  type: 'js',
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'static/font/',
              },
            },
          ],
        },
        {
          // All images should use this, but we need to bring them into components
          test: /\.(gif|png)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'static/img/',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          loader: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      modules: [RENDERER_PROCESS_ROOT, 'node_modules', __dirname],
      extensions: ['.js', '.jsx', '.scss', '.json'],
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: `${STATIC_ROOT}/`,
          to: `${DIST_ROOT}/web/static/`,
          ignore: ['daemon/**/*', 'font/**/*'],
        },
      ]),
    ],
    externals: [
      (function() {
        var IGNORES = [
          'electron',
          'breakdance',
          'i18n',
          // 'electron-is-dev',
          // 'store',
          // 'y18n',
          // 'tls',
          // 'net'
        ];
        return function(context, request, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            // return callback(null, "require('" + request + "')");
            return callback(null, '{}');
          }
          return callback();
        };
      })(),
    ],
  };
};
