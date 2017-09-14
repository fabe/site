const path = require('path');
const glob = require('glob');

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|png|jpg|gif|mp4|webm)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          'babel-loader',
          'styled-modules/loader',
          'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|mp4|webm)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'static/',
              publicPath: '/_next/',
              name: '[name]-[hash:12].[ext]',
              limit: 1000,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '100',
                speed: 4,
              },
              mozjpeg: {
                progressive: true,
                quality: 90,
              },
            },
          },
        ],
      }
    );
    return config;
  },
};
