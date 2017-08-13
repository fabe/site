module.exports = {
  plugins: [require('postcss-import'), require('autoprefixer')({ grid: true }), require('postcss-csso')],
};
