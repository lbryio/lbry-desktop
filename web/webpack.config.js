const { WEBPACK_WEB_PORT, LBRY_WEB_API, BRANDED_SITE } = require('../config.js');
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.base.config.js');
const serviceWorkerConfig = require('./webpack.sw.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HookShellScriptPlugin = require('hook-shell-script-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const { insertToHead, buildHead } = require('./src/html');
const { insertVariableXml, getOpenSearchXml } = require('./src/xml');

const CUSTOM_ROOT = path.resolve(__dirname, '../custom/');
const STATIC_ROOT = path.resolve(__dirname, '../static/');
const UI_ROOT = path.resolve(__dirname, '../ui/');
const DIST_STAGE = { DIR: 'dist_stage', PATH: path.resolve(__dirname, 'dist_stage/') };
const DIST = { DIR: 'dist', PATH: path.resolve(__dirname, 'dist/') };
const WEB_STATIC_ROOT = path.resolve(__dirname, 'static/');
const WEB_PLATFORM_ROOT = __dirname;
const isProduction = process.env.NODE_ENV === 'production';
const hasSentryToken = process.env.SENTRY_AUTH_TOKEN !== undefined;

const BUILD_TIME_UTC = Date.now();
const BUILD_TIME_STR = new Date(BUILD_TIME_UTC).toISOString().replace(/[-:T]/g, '').slice(0, 12);
const COMMIT_ID = process.env.COMMIT_ID || '';
const BUILD_REV = `${BUILD_TIME_STR}${COMMIT_ID ? `.${COMMIT_ID.slice(0, 10)}` : ''}`;

const useStagingRoot = hasSentryToken && isProduction && process.platform !== 'win32';
const output = useStagingRoot ? DIST_STAGE : DIST;

if (useStagingRoot) {
  // Clear staging folder
  const stagePublicPath = `${DIST_STAGE.PATH}/public/`;
  if (fs.existsSync(stagePublicPath)) {
    fs.readdirSync(stagePublicPath)
      .filter((f) => /^.*\.(json|js|map)$/.test(f))
      .map((f) => fs.unlinkSync(stagePublicPath + f));
  }
}

// ****************************************************************************
// copyWebpackCommands
// ****************************************************************************

const copyWebpackCommands = [
  {
    from: `${STATIC_ROOT}/index-web.html`,
    to: `${output.PATH}/index.html`,
    // add javascript script to index.html, generate/insert metatags
    transform(content, path) {
      return insertToHead(content.toString(), buildHead(), BUILD_REV);
    },
    force: true,
  },
  {
    from: `${STATIC_ROOT}/opensearch.xml`,
    to: `${output.PATH}/opensearch.xml`,
    transform(content, path) {
      return insertVariableXml(content.toString(), getOpenSearchXml());
    },
    force: true,
  },
  {
    from: `${STATIC_ROOT}/robots.txt`,
    to: `${output.PATH}/robots.txt`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon.png`,
    to: `${output.PATH}/public/favicon.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/favicon-spaceman.png`,
    to: `${output.PATH}/public/favicon-spaceman.png`,
    force: true,
  },
  {
    from: `${STATIC_ROOT}/img/v2-og.png`,
    to: `${output.PATH}/public/v2-og.png`,
  },
  {
    from: `${STATIC_ROOT}/img/cookie.svg`,
    to: `${output.PATH}/public/img/cookie.svg`,
  },
  {
    from: `${STATIC_ROOT}/cast/`,
    to: `${output.PATH}/public/cast/`,
  },
  {
    from: `${STATIC_ROOT}/font/`,
    to: `${output.PATH}/public/font/`,
  },
  {
    from: `${WEB_STATIC_ROOT}/pwa/`,
    to: `${output.PATH}/public/pwa/`,
  },
  {
    from: `${STATIC_ROOT}/../custom/homepages/v2/announcement`,
    to: `${output.PATH}/announcement`,
  },
  {
    from: `${STATIC_ROOT}/img/spaceman_pattern.png`,
    to: `${output.PATH}/public/img/spaceman_pattern.png`,
  },
];

const CUSTOM_OG_PATH = `${CUSTOM_ROOT}/v2-og.png`;
if (fs.existsSync(CUSTOM_OG_PATH)) {
  copyWebpackCommands.push({
    from: CUSTOM_OG_PATH,
    to: `${output.PATH}/public/v2-og.png`,
    force: true,
  });
}

const ROBOTS_TXT_PATH = `${CUSTOM_ROOT}/robots.txt`;
if (fs.existsSync(ROBOTS_TXT_PATH)) {
  copyWebpackCommands.push({
    from: ROBOTS_TXT_PATH,
    to: `${output.PATH}/robots.txt`,
    force: true,
  });
}

if (!isProduction) {
  copyWebpackCommands.push({
    from: `${STATIC_ROOT}/app-strings.json`,
    to: `${output.PATH}/app-strings.json`,
  });
}

// ****************************************************************************
// plugins
// ****************************************************************************

const plugins = [
  new WriteFilePlugin(),
  new CopyWebpackPlugin(copyWebpackCommands),
  new DefinePlugin({
    IS_WEB: JSON.stringify(true),
    'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL || LBRY_WEB_API),
    'process.env.BUILD_REV': JSON.stringify(BUILD_REV),
  }),
  new ProvidePlugin({
    __: ['i18n.js', '__'],
  }),
];

if (useStagingRoot) {
  plugins.push(
    new HookShellScriptPlugin({
      afterEmit: [`cp -a ${DIST_STAGE.DIR}/. ${DIST.DIR}/`],
    })
  );
}

if (isProduction && hasSentryToken) {
  plugins.push(
    new SentryWebpackPlugin({
      include: `./${DIST_STAGE.DIR}`,
      ignoreFile: '.sentrycliignore',
      ignore: ['node_modules', 'webpack.config.js'],
      configFile: 'sentry.properties',
      release: BUILD_REV,
    })
  );
}

// ****************************************************************************
// webConfig
// ****************************************************************************

const webConfig = {
  target: 'web',
  entry: {
    [`ui-${BUILD_REV}`]: '../ui/index.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, `${output.DIR}/public`),
    publicPath: '/public/',
    chunkFilename: '[name]-[chunkhash].js',
  },
  devServer: {
    port: WEBPACK_WEB_PORT,
    contentBase: path.join(__dirname, DIST.DIR),
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
