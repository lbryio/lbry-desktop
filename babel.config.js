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
      {
        // The vendored wallet code (and its tests) rely on real ES2015+ semantics (spreading a Uint8Array or a Set).
        // The default loose ES5 output turns `[...x]` into `[].concat(x)`, which is wrong for those, so
        // build it for the runtimes we ship on (Electron's Node and Chromium) without loose mode.
        test: /[\\/](extras|__tests__)[\\/]lbc[\\/]/,
        presets: [['@babel/env', { loose: false, modules: isTest ? 'commonjs' : false, targets: isTest ? { node: 'current' } : { electron: '30' } }]],
      },
    ],
    // @noble and @scure 2.x are ES modules only, so Jest needs Babel to transform them.
    ignore: [/node_modules\/(?!(@noble|@scure)\/)/],
  };
};
