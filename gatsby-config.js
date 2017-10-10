var csso = require('postcss-csso');
var autoprefixer = require('autoprefixer');

module.exports = {
  siteMetadata: {
    title: 'Fabian W. Schultz',
    author: 'Fabian W. Schultz',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `tomato`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-copy-linked-files',
          // {
          //   resolve: `gatsby-remark-images`,
          //   options: {
          //     maxWidth: 2000,
          //     linkImagesToOriginal: false,
          //   },
          // },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-transformer-javascript-static-exports`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-postcss-sass`,
      options: {
        postCssPlugins: [autoprefixer(), csso()],
        precision: 5, // SASS default: 5
      },
    },
  ],
};
