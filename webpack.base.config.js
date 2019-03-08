const path = require('path');
const merge = require('webpack-merge');
const { DefinePlugin, ProvidePlugin } = require('webpack');

const UI_ROOT = path.resolve(__dirname, 'src/ui/');
const STATIC_ROOT = path.resolve(__dirname, 'static/');
const DIST_ROOT = path.resolve(__dirname, 'dist/');

const baseConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
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
        test: /\.scss$/,
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
            outputPath: 'ui/img',
            name: '[name].[ext]',
          },
        },
      },
      {
        // font/inter includes a basic css file applying the fonts
        // Everywhere else we use .scss
        test: /\.(css|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'ui/font',
          },
        },
      },
      {
        test: /\.glsl/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'ui/three',
          },
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
    new ProvidePlugin({
      i18n: ['i18n', 'default'],
      __: ['i18n/__', 'default'],
      __n: ['i18n/__n', 'default'],
    }),
    new DefinePlugin({
      __static: `"${path.join(__dirname, 'static').replace(/\\/g, '\\\\')}"`,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SDK_API_URL': JSON.stringify(process.env.SDK_API_URL),
    }),
  ],
};

module.exports = baseConfig;
