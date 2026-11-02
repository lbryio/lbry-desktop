const path = require('path');

module.exports = ({ file, options, env }) => {
  env = env || {};
  options = options || {};
  options.cssnext = options.cssnext || null;
  options.autoprefixer = options.autoprefixer || null;
  options.cssnano = options.cssnano || null;

  const filePath = typeof file === 'string' ? file : '';
  const fileDir = filePath ? path.dirname(filePath) : process.cwd();

  return {
    parser: filePath.endsWith('.sss') ? 'sugarss' : false,
    plugins: {
      'postcss-import': { root: fileDir },
      cssnano: env === 'production' ? options.cssnano : false,
    },
  };
};
