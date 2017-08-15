module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-cssnext')({
      features: {
        customProperties: false,
        calc: false,
        autoprefixer: {
          grid: true,
        },
      },
    }),
    require('postcss-csso')(),
  ],
};
