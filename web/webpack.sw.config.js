const NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { getIfUtils } = require('webpack-config-utils');
const { ifProduction } = getIfUtils(NODE_ENV);
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_PLATFORM_ROOT = __dirname;

module.exports = {
  target: 'web',
  mode: ifProduction('production', 'development'),
  devtool: ifProduction('source-map', 'eval-cheap-module-source-map'),

  entry: path.join(WEB_PLATFORM_ROOT, '/src/service-worker.js'),

  output: {
    filename: 'sw.js',
    path: DIST_ROOT,
    globalObject: 'this',
  },

  plugins: [
    new WriteFilePlugin(),
    new Dotenv({
      allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false, // hide any errors
      defaults: true, // load '.env.defaults' as the default values if empty.
    }),
  ],

  resolve: {
    alias: {
      $web: WEB_PLATFORM_ROOT,
      config: path.resolve(__dirname, '../config.js'),
      fs: `${WEB_PLATFORM_ROOT}/stubs/fs.js`,
    },
  },
};
