const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const TerserPlugin = require('terser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const { ifProduction } = getIfUtils(NODE_ENV);

const UI_ROOT = path.resolve(__dirname, 'src/ui/');
const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

// There are a two other uses of this value that can't access it from webpack
// They exist in
//    src/platforms/electron/devServer.js
//    static/index.dev.html
const WEBPACK_PORT = 9090;

console.log(ifProduction('production', 'development'));

let baseConfig = {
  mode: ifProduction('production', 'development'),
  devtool: ifProduction(false, 'cheap-module-eval-source-map'),
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: true,
          toplevel: true,
        },
      }),
    ],
  },
  node: {
    __dirname: false,
  },
  devServer: {
    historyApiFallback: true,
    port: WEBPACK_PORT,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.module.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /\.module.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'static/img',
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'static/font',
          },
        },
      },
      {
        test: /\.(vert|frag|glsl)$/,
        use: {
          loader: 'raw-loader',
        },
      },
    ],
  },
  // Allows imports for all directories inside '/ui'
  resolve: {
    modules: [UI_ROOT, 'node_modules', __dirname],
    extensions: ['.js', '.jsx', '.json', '.scss'],
    alias: {
      'lbry-redux$': 'lbry-redux/dist/bundle.es.js',

      // Build optimizations for 'redux-persist-transform-filter'
      'redux-persist-transform-filter': 'redux-persist-transform-filter/index.js',
      'lodash.get': 'lodash-es/get',
      'lodash.set': 'lodash-es/set',
      'lodash.unset': 'lodash-es/unset',
      'lodash.pickby': 'lodash-es/pickBy',
      'lodash.isempty': 'lodash-es/isEmpty',
      'lodash.forin': 'lodash-es/forIn',
      'lodash.clonedeep': 'lodash-es/cloneDeep',
    },
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new ProvidePlugin({
      i18n: ['i18n', 'default'],
      __: ['i18n/__', 'default'],
      __n: ['i18n/__n', 'default'],
    }),
    new DefinePlugin({
      __static: `"${path.join(__dirname, 'static').replace(/\\/g, '\\\\')}"`,
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL),
      'process.env.LBRY_API_URL': JSON.stringify(process.env.LBRY_API_URL),
      WEBPACK_PORT,
    }),
  ],
};

module.exports = baseConfig;
