import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';
import includePaths from 'rollup-plugin-includepaths';
import copy from 'rollup-plugin-copy';
import alias from 'rollup-plugin-alias';

let includePathOptions = {
  include: {},
  paths: ['src'],
  external: [],
  extensions: ['.js'],
};

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.es.js',
    format: 'cjs',
  },
  plugins: [
    alias({
      entries: [
        {
          find: 'flow-typed',
          replacement: './flow-typed',
        },
      ],
    }),
    flow({ all: true }),
    includePaths(includePathOptions),
    babel({
      babelrc: false,
      presets: [],
    }),
    copy({ targets: [{ src: './flow-typed', dest: 'dist' }] }),
  ],
  external: ['lbry-redux'],
};
