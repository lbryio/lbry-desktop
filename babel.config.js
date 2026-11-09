module.exports = api => {
  api.cache(false);

  return {
    presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
    plugins: [
      'import-glob',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      ['@babel/plugin-proposal-private-methods', { 'loose': false }],
      ['@babel/plugin-proposal-private-property-in-object', { 'loose': false }],
      '@babel/plugin-proposal-class-properties',
      'react-hot-loader/babel',
    ],
    // Flow and TypeScript syntax can't coexist in one parser config,
    // so each is scoped to its own file extensions.
    overrides: [
      {
        test: /\.jsx?$/,
        presets: ['@babel/flow'],
        plugins: ['@babel/plugin-transform-flow-strip-types'],
      },
      {
        test: /\.tsx?$/,
        presets: ['@babel/preset-typescript'],
      },
    ],
    ignore: [/node_modules/],
  };
};
