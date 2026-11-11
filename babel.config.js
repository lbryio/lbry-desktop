module.exports = api => {
  api.cache(false);

  // Jest runs on Node and needs CommonJS modules; webpack needs ESM kept
  // intact for tree-shaking. (api.env() is unusable with api.cache(false),
  // so read the env var directly — Jest sets NODE_ENV=test.)
  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: [['@babel/env', { loose: true, modules: isTest ? 'commonjs' : false }], '@babel/react'],
    plugins: [
      'import-glob',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ['@babel/plugin-proposal-private-methods', { 'loose': false }],
      ['@babel/plugin-proposal-private-property-in-object', { 'loose': false }],
      '@babel/plugin-proposal-class-properties',
      'react-hot-loader/babel',
    ],
    overrides: [
      {
        test: /\.tsx?$/,
        presets: ['@babel/preset-typescript'],
      },
    ],
    ignore: [/node_modules/],
  };
};
