module.exports = ({ file, options, env }) => {
  env = env || {};
  file = file || {};
  options = options || {};
  options.cssnext = options.cssnext || null;
  options.autoprefixer = options.autoprefixer || null;
  options.cssnano = options.cssnano || null;

  return {
    parser: file.extname === '.sss' ? 'sugarss' : false,
    plugins: {
      'postcss-import': { root: file.dirname },
      cssnano: env === 'production' ? options.cssnano : false,
    },
  };
};
