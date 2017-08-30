module.exports = {
  plugins: [
    require('postcss-import')({ path: 'styles' }),
    require('autoprefixer'),
    require('postcss-simple-vars'),
    require('postcss-csso'),
  ],
};
