module.exports = api => {
  api.cache(false);

  return {
    presets: ['@babel/env', '@babel/react', '@babel/flow'],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      'import-glob',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-proposal-class-properties',
      'react-hot-loader/babel',
    ],
    ignore: [/node_modules/],
  };
};
