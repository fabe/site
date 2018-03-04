var csso = require('postcss-csso');
var autoprefixer = require('autoprefixer');
var cssvariables = require('postcss-css-variables');
var flexbugs = require('postcss-flexbugs-fixes');

module.exports = {
  siteMetadata: {
    title: 'Fabian W. Schultz',
    author: 'Fabian W. Schultz',
    siteUrl: `https://fabianschultz.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `black`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    `gatsby-transformer-javascript-static-exports`,
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
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-44440473-5`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-plugin-postcss-sass`,
      options: {
        postCssPlugins: [autoprefixer(), cssvariables(), csso()],
        precision: 5, // SASS default: 5
      },
    },
  ],
};
