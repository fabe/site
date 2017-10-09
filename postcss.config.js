module.exports = {
  plugins: [
    require('postcss-import')({ path: 'styles' }),
    require('postcss-nested'),
    require('autoprefixer')({ grid: true }),
    require('postcss-simple-vars'),
    require('postcss-color-function'),
    require('postcss-csso'),
  ],
};
