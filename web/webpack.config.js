const { WEBPACK_WEB_PORT, LBRY_WEB_API, BRANDED_SITE } = require('../config.js');
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const serviceWorkerConfig = require('./webpack.sw.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { getJsBundleId } = require('./bundle-id.js');
const { insertToHead, buildHead } = require('./src/html');
const { insertVariableXml, getOpenSearchXml } = require('./src/xml');

const CUSTOM_ROOT = path.resolve(__dirname, '../custom/');
const STATIC_ROOT = path.resolve(__dirname, '../static/');
const UI_ROOT = path.resolve(__dirname, '../ui/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');
const WEB_STATIC_ROOT = path.resolve(__dirname, 'static/');
const WEB_PLATFORM_ROOT = __dirname;
const isProduction = process.env.NODE_ENV === 'production';
const hasSentryToken = process.env.SENTRY_AUTH_TOKEN !== undefined;
const jsBundleId = getJsBundleId();

// copy static files to dist folder
const copyWebpackCommands = [
  {
    from: `${STATIC_ROOT}/index-web.html`,
    to: `${DIST_ROOT}/index.html`,
    // add javascript script to index.html, generate/insert metatags
    transform(content, path) {
      return insertToHead(content.toString(), buildHead());
    },
    force: true,
  },
  {
    from: `${STATIC_ROOT}/opensearch.xml`,
    to: `${DIST_ROOT}/opensearch.xml`,
    transform(content, path) {
      return insertVariableXml(content.toString(), getOpenSearchXml());
    },
    force: true,
  },
  {
    from: `${STATIC_ROOT}/robots.txt`,
    to: `${DIST_ROOT}/robots.txt`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon.png`,
    to: `${DIST_ROOT}/public/favicon.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon-spaceman.png`,
    to: `${DIST_ROOT}/public/favicon-spaceman.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/v2-og.png`,
    to: `${DIST_ROOT}/public/v2-og.png`,
  },
  {
    from: `${STATIC_ROOT}/font/`,
    to: `${DIST_ROOT}/public/font/`,
  },
  {
    from: `${WEB_STATIC_ROOT}/pwa/`,
    to: `${DIST_ROOT}/public/pwa/`,
  },
  {
    from: `${STATIC_ROOT}/../custom/homepages/v2/announcement`,
    to: `${DIST_ROOT}/announcement`,
  },
];

const CUSTOM_OG_PATH = `${CUSTOM_ROOT}/v2-og.png`;
if (fs.existsSync(CUSTOM_OG_PATH)) {
  copyWebpackCommands.push({
    from: CUSTOM_OG_PATH,
    to: `${DIST_ROOT}/public/v2-og.png`,
    force: true,
  });
}

// clear the dist folder of existing js files before compilation
let regex = /^.*\.(json|js|map)$/;
// only run on nonprod environments to avoid side effects on prod
if (!isProduction) {
  const path = `${DIST_ROOT}/public/`;
  if (fs.existsSync(path)) {
    fs.readdirSync(path)
      .filter((f) => regex.test(f))
      .map((f) => fs.unlinkSync(path + f));
  }
}

const ROBOTS_TXT_PATH = `${CUSTOM_ROOT}/robots.txt`;
if (fs.existsSync(ROBOTS_TXT_PATH)) {
  copyWebpackCommands.push({
    from: ROBOTS_TXT_PATH,
    to: `${DIST_ROOT}/robots.txt`,
    force: true,
  });
}

if (!isProduction) {
  copyWebpackCommands.push({
    from: `${STATIC_ROOT}/app-strings.json`,
    to: `${DIST_ROOT}/app-strings.json`,
  });
}

let plugins = [
  new WriteFilePlugin(),
  new CopyWebpackPlugin(copyWebpackCommands),
  new DefinePlugin({
    IS_WEB: JSON.stringify(true),
    'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL || LBRY_WEB_API),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
];

if (isProduction && hasSentryToken) {
  plugins.push(
    new SentryWebpackPlugin({
      include: './dist',
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: 'sentry.properties',
    })
  );
}

const webConfig = {
  target: 'web',
  entry: {
    [`ui-${jsBundleId}`]: '../ui/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/public/'),
    publicPath: '/public/',
    chunkFilename: '[name]-[chunkhash].js',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true, // to allow debugging with ngrok
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        options: {
          presets: ['@babel/env', '@babel/react', '@babel/flow'],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
      {
        loader: 'preprocess-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        options: {
          TARGET: 'web',
          BRANDED_SITE: BRANDED_SITE,
          ppOptions: {
            type: 'js',
          },
        },
      },
    ],
  },
  resolve: {
    modules: [UI_ROOT, __dirname],

    alias: {
      // lbryinc: '../extras/lbryinc',
      $web: WEB_PLATFORM_ROOT,
      $ui: UI_ROOT,
      electron: `${WEB_PLATFORM_ROOT}/stubs/electron.js`,
      fs: `${WEB_PLATFORM_ROOT}/stubs/fs.js`,
    },
  },
  plugins,
};

module.exports = [merge(baseConfig, webConfig), serviceWorkerConfig];
