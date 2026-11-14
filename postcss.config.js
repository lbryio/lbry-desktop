module.exports = {
  plugins: {
    'postcss-import': {
      resolve: function(id) {
        // Handle ~ imports for node_modules
        if (id.startsWith('~')) {
          try {
            return require.resolve(id.substring(1));
          } catch (e) {
            return id;
          }
        }
        return id;
      },
    },
    cssnano: process.env.NODE_ENV === 'production' ? {} : false,
  },
};
