const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const { ifProduction } = getIfUtils(NODE_ENV);

const UI_ROOT = path.resolve(__dirname, 'src/ui/');
const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

console.log(ifProduction('production', 'development'))

let baseConfig = {
  mode: ifProduction('production', 'development'),
  devtool: ifProduction(false, 'inline-cheap-source-map'),
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
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(png|svg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: '$/static/img',
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: '$/static/font',
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
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new BundleAnalyzerPlugin(),
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
    }),
  ],
};

module.exports = baseConfig;
